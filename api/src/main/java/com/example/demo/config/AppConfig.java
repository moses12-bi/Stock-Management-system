package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class AppConfig {
    private TwoFactor twoFactor = new TwoFactor();
    private Jwt jwt = new Jwt();
    private Client client = new Client();

    @Data
    public static class TwoFactor {
        private int codeLength = 6;
        private int codeExpiration = 300;
        private boolean enabled = true;
    }

    @Data
    public static class Jwt {
        private String secret;
        private long expirationMs = 86400000; // 24 hours
    }

    @Data
    public static class Client {
        private String url = "http://localhost:3000";
    }
} 