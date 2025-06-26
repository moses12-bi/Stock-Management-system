package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private final TwoFactor twoFactor = new TwoFactor();
    private final Jwt jwt = new Jwt();
    private final Client client = new Client();

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
        private String url;
    }
} 