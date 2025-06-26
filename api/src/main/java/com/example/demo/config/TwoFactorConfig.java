package com.example.demo.config;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TwoFactorConfig {
    private final AppProperties appProperties;

    public int getCodeLength() {
        return appProperties.getTwoFactor().getCodeLength();
    }

    public int getCodeExpiration() {
        return appProperties.getTwoFactor().getCodeExpiration();
    }

    public boolean isEnabled() {
        return appProperties.getTwoFactor().isEnabled();
    }
}
