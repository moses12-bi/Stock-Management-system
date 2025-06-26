package com.example.demo.controllers;

import com.example.demo.config.JwtConfig;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dtos.PasswordResetRequest;
import com.example.demo.services.auth.EmailService;
import java.util.UUID;
import com.example.demo.dto.LoginRequest; // Added import
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.TwoFactorRequest; // Added import
import java.time.LocalDateTime;

import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.PasswordResetTokenRepository;
import com.example.demo.models.PasswordResetToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.services.auth.AuthenticationService;
import com.example.demo.services.auth.CustomUserDetailsService;
import com.example.demo.models.Users;
import java.util.Map;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.example.demo.config.TwoFactorConfig;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthenticationService authenticationService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JwtConfig jwtConfig;
    private final EmailService emailService;
    private final TwoFactorConfig twoFactorConfig;



    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authenticationService.login(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (AuthenticationException e) {
            // Log the authentication failure
            // logger.warn("Login attempt failed for email {}: {}", loginRequest.getEmail(), e.getMessage());
            System.err.println("Authentication failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials", "message", e.getMessage()));
        } catch (RuntimeException e) {
            // Log other runtime exceptions from the service
            // logger.error("Error during login for email {}: {}", loginRequest.getEmail(), e.getMessage(), e);
             System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // Log unexpected errors
            // logger.error("Unexpected error during login for email {}: {}", loginRequest.getEmail(), e.getMessage(), e);
            System.err.println("Unexpected login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred during login."));
        }
    }

    @PostMapping("/verify-2fa")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> verify2FA(@RequestBody Map<String, String> verificationRequestMap) {
        try {
            String email = verificationRequestMap.get("email");
            String code = verificationRequestMap.get("code");

            if (email == null || code == null) {
                return ResponseEntity.badRequest().body("Email and code are required");
            }

            TwoFactorRequest twoFactorRequest = new TwoFactorRequest(email, code);
            AuthResponse authResponse = authenticationService.verifyTwoFactorCode(twoFactorRequest);
            
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) { // Catch specific runtime exceptions from AuthenticationService
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (Exception e) { // Catch any other unexpected errors
            // Log the exception for debugging
            // logger.error("Unexpected error during 2FA verification: ", e);
            // (Assuming a logger is available, otherwise System.err.println)
            System.err.println("Unexpected error during 2FA verification: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred during verification."));
        }
    }

    @PostMapping("/resend-2fa")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> resend2FA(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null) {
                return ResponseEntity.badRequest().body("Email is required");
            }

            Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            userDetailsService.sendTwoFactorCode(user);

            return ResponseEntity.ok(Map.of(
                "message", "Verification code has been resent to your email",
                "email", user.getEmail(),
                "debug_code", user.getTwoFactorCode() // Only for development
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to resend verification code: " + e.getMessage());
        }
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body("Email is required");
        }



        // Clean up expired tokens
        passwordResetTokenRepository.deleteByExpiryDateLessThan(LocalDateTime.now());

        // Generate new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setToken(token);
        passwordResetToken.setEmail(email);
        passwordResetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        passwordResetTokenRepository.save(passwordResetToken);

        // Send email
        emailService.sendPasswordResetEmail(email, token);

        return ResponseEntity.ok(Map.of("message", "Password reset link has been sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        String token = request.getToken();
        String newPassword = request.getNewPassword();

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }

        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
            .orElseThrow(() -> new UsernameNotFoundException("Invalid or expired token"));

        if (passwordResetToken.isExpired()) {
            passwordResetTokenRepository.delete(passwordResetToken);
            return ResponseEntity.badRequest().body("Token has expired");
        }

        Users user = userRepository.findByEmail(passwordResetToken.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Clean up the token
        passwordResetTokenRepository.delete(passwordResetToken);

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }
}
