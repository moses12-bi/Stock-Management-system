package com.example.demo.services.auth;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.TwoFactorRequest;
import com.example.demo.models.Users;
import com.example.demo.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.demo.config.JwtConfig;
import com.example.demo.config.TwoFactorConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;
    private final TwoFactorConfig twoFactorConfig;
    private final EmailService emailService;

    public AuthenticationService(AuthenticationManager authenticationManager,
                              UserRepository userRepository,
                              PasswordEncoder passwordEncoder,
                              JwtConfig jwtConfig,
                              TwoFactorConfig twoFactorConfig,
                              EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtConfig = jwtConfig;
        this.twoFactorConfig = twoFactorConfig;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Users user = Users.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();

        userRepository.save(user);
        
        String jwtToken = jwtConfig.generateToken(request.getEmail());
        return AuthResponse.builder()
                .token(jwtToken)
                .email(request.getEmail())
                .requiresTwoFactor(false)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        // Generate and send 2FA code
        String code = generateCode();
        user.setTwoFactorCode(code);
        // Assuming getCodeExpiration() returns minutes, consistent with resendTwoFactorCode
        user.setTwoFactorCodeExpiration(LocalDateTime.now().plusMinutes(twoFactorConfig.getCodeExpiration()));
        userRepository.save(user);

        try {
            emailService.sendTwoFactorCode(user.getEmail(), code);
            logger.info("2FA code sent successfully to: {} after login", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send 2FA code email after login: {}", e.getMessage());
            // Log the code in dev/debug mode for testing if email fails
            logger.info("Development mode - 2FA code for {}: {}", user.getEmail(), code);
        }
        
        // Return response indicating 2FA is required, NO token yet.
        return AuthResponse.builder()
                .email(request.getEmail())
                .requiresTwoFactor(true)
                .build();
    }

    public AuthResponse verifyTwoFactorCode(TwoFactorRequest request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        if (user.getTwoFactorCode() == null || !user.getTwoFactorCode().equals(request.getCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        if (user.getTwoFactorCodeExpiration() == null || 
            user.getTwoFactorCodeExpiration().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }

        // Clear the 2FA code after successful verification
        user.setTwoFactorCode(null);
        user.setTwoFactorCodeExpiration(null);
        userRepository.save(user);

        String token = jwtConfig.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .requiresTwoFactor(false)
                .build();
    }

    public AuthResponse resendTwoFactorCode(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        String code = generateCode();
        user.setTwoFactorCode(code);
        user.setTwoFactorCodeExpiration(LocalDateTime.now().plusMinutes(twoFactorConfig.getCodeExpiration()));
        userRepository.save(user);

        try {
            emailService.sendTwoFactorCode(user.getEmail(), code);
            logger.info("2FA code sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send 2FA code email: {}", e.getMessage());
            logger.info("Development mode - 2FA code for {}: {}", user.getEmail(), code);
        }

        return AuthResponse.builder()
                .email(user.getEmail())
                .requiresTwoFactor(true)
                .build();
    }

    private String generateCode() {
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < twoFactorConfig.getCodeLength(); i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
}
