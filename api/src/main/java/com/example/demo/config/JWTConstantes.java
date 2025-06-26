package com.example.demo.config;

public class JWTConstantes {
    public final static long JWT_EXPIRATION = 86400000; // 24 hours in milliseconds
    public final static String SECRET_KEY = "${jwt.secret}";

    public static String getSecretKey() {
        return System.getenv("JWT_SECRET") != null ? System.getenv("JWT_SECRET") : SECRET_KEY;
    }
}
