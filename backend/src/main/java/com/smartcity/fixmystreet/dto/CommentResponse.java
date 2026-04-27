package com.smartcity.fixmystreet.dto;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private String authorEmail;
    private String authorRole;

    public CommentResponse(){}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }
    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getAuthorRole() {
        return authorRole;
    }
    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }
}
