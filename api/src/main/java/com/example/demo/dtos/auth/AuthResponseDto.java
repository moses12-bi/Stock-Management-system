package com.example.demo.dtos.auth;

public class AuthResponseDto {
    private String accessToken;
    private String tokenType = "Bearer ";
    private String error;
    private String message;

    public AuthResponseDto() {
        this.accessToken = null;
        this.error = null;
        this.message = null;
    }

    public AuthResponseDto(String accessToken) {
        this.accessToken = accessToken;
        this.error = null;
        this.message = null;
    }

    public AuthResponseDto withError(String error) {
        this.error = error;
        return this;
    }

    public AuthResponseDto withMessage(String message) {
        this.message = message;
        return this;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
