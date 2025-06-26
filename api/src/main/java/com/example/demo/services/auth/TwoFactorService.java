package com.example.demo.services.auth;

import com.example.demo.config.TwoFactorConfig;
import com.example.demo.models.Users;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
public class TwoFactorService {
    @Autowired
    private TwoFactorConfig twoFactorConfig;
    
    @Autowired
    private UserRepository userRepository;

    private final Random random = new Random();

    public String generateCode() {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < twoFactorConfig.getCodeLength(); i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    public boolean isCodeValid(String code, Users user) {
        if (user.getTwoFactorCode() == null || user.getTwoFactorCodeExpiration() == null) {
            return false;
        }
        return user.getTwoFactorCode().equals(code) && 
               !isCodeExpired(user);
    }

    public void sendCodeToUser(Users user) {
        String code = generateCode();
        user.setTwoFactorCode(code);
        user.setTwoFactorCodeExpiration(LocalDateTime.now().plusSeconds(twoFactorConfig.getCodeExpiration()));
        userRepository.save(user);
    }

    private boolean isCodeExpired(Users user) {
        return ChronoUnit.SECONDS.between(LocalDateTime.now(), user.getTwoFactorCodeExpiration()) <= 0;
    }

    public void clearCode(Users user) {
        user.setTwoFactorCode(null);
        user.setTwoFactorCodeExpiration(null);
        userRepository.save(user);
    }
}
