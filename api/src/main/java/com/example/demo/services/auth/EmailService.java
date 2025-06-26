package com.example.demo.services.auth;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.client.url}")
    private String clientUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTwoFactorCode(String toEmail, String code) {
        logger.info("Attempting to send 2FA code to: {}", toEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your Verification Code");
            message.setText("Hello,\n\n" +
                           "Your verification code is: " + code + "\n\n" +
                           "This code will expire in 5 minutes.\n\n" +
                           "If you did not request this code, please ignore this email.\n\n" +
                           "Best regards,\n" +
                           "Your Application Team");
            
            logger.info("Sending email with 2FA code...");
            mailSender.send(message);
            logger.info("Verification code sent successfully to: {}", toEmail);
        } catch (MailException e) {
            logger.error("Failed to send verification code to: {} - Error: {}", toEmail, e.getMessage());
            logger.error("Stack trace:", e);
            
            // For development/testing, log the code
            logger.info("Development mode - Verification code for {}: {}", toEmail, code);
            
            // Don't throw the exception, just log it
            // This allows the application to continue even if email sending fails
            // The code will still be available in the logs for testing
        }
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        logger.info("Attempting to send password reset email to: {}", toEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request");
            message.setText("Click the following link to reset your password:\n\n" +
                           clientUrl + "/reset-password?token=" + token);
            
            logger.info("Sending password reset email...");
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", toEmail);
        } catch (MailException e) {
            logger.error("Failed to send password reset email to: {} - Error: {}", toEmail, e.getMessage());
            logger.error("Stack trace:", e);
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }
}
