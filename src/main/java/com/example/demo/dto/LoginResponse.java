package com.example.demo.dto;

public class LoginResponse {

    private String token;
    private Integer userId;
    private String name;
    private String emailid;

    public LoginResponse(
            String token,
            Integer userId,
            String name,
            String emailid) {

        this.token = token;
        this.userId = userId;
        this.name = name;
        this.emailid = emailid;
    }

    public String getToken() {
        return token;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmailid() {
        return emailid;
    }
}