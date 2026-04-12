package com.smartcity.fixmystreet.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String role;

    public AuthResponse(String token, String email, String role){
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public String getToken() {
        return token;
    }
    public String getEmail() {
        return email;
    }
    public String getRole() {
        return role;
    }
}
