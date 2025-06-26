package com.example.demo.services.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Random;
import java.time.LocalDateTime;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import com.example.demo.config.TwoFactorConfig;
import com.example.demo.config.JwtConfig;

import com.example.demo.models.Users;
import com.example.demo.repositories.UserRepository;
import java.util.Arrays;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private TwoFactorConfig twoFactorConfig;

    @Autowired
    private JwtConfig jwtConfig;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        // Initialize roles collection to prevent lazy loading issues
        user.getRoles().size();
        
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList())
        );
    }

    public String sendTwoFactorCode(Users user) {
        System.out.println("=== Starting sendTwoFactorCode ===");
        System.out.println("User email: " + user.getEmail());
        System.out.println("2FA enabled: " + twoFactorConfig.isEnabled());
        
        try {
            if (!twoFactorConfig.isEnabled()) {
                System.out.println("2FA is disabled, generating token directly");
                String token = jwtConfig.generateToken(user.getEmail());
                System.out.println("Token generated successfully");
                return token;
            }

            System.out.println("Generating 2FA code...");
            String code = generateCode();
            System.out.println("Code generated: " + code);
            
            System.out.println("Updating user with 2FA code...");
            user.setTwoFactorCode(code);
            user.setTwoFactorCodeExpiration(LocalDateTime.now().plusMinutes(twoFactorConfig.getCodeExpiration()));
            userRepository.save(user);
            System.out.println("User updated successfully");
            
            try {
                System.out.println("Sending email with 2FA code...");
                emailService.sendTwoFactorCode(user.getEmail(), code);
                System.out.println("Email sent successfully");
            } catch (Exception e) {
                System.err.println("Failed to send 2FA code email: " + e.getMessage());
                e.printStackTrace();
                // For development, log the code
                System.out.println("2FA code for " + user.getEmail() + ": " + code);
                // Don't throw the exception, just log it
            }
            
            return code;
        } catch (Exception e) {
            System.err.println("Error in sendTwoFactorCode: " + e.getMessage());
            e.printStackTrace();
            System.err.println("Stack trace: " + Arrays.toString(e.getStackTrace()));
            throw e;
        } finally {
            System.out.println("=== Completed sendTwoFactorCode ===");
        }
    }

    private String generateCode() {
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < twoFactorConfig.getCodeLength(); i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    public boolean verifyTwoFactorCode(Users user, String code) {
        if (user.getTwoFactorCode() == null || !user.getTwoFactorCode().equals(code)) {
            return false;
        }
        if (user.getTwoFactorCodeExpiration() == null || user.getTwoFactorCodeExpiration().isBefore(LocalDateTime.now())) {
            return false;
        }
        return true;
    }
}
