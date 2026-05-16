package com.smartcity.fixmystreet.dto;

import com.smartcity.fixmystreet.model.Location;
import com.smartcity.fixmystreet.model.ReportedIssue;
import com.smartcity.fixmystreet.model.ResolutionRating;

import java.time.LocalDateTime;

public class IssueResponse {
    private Long id;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private Double latitude;
    private Double longitude;
    private String address;
    private String authorEmail;
    private Long categoryId;
    private String photoUrl;
    private String assignedWorkerEmail;
    private boolean isRated;
    private Integer stars;
    private String feedback;

    public IssueResponse() {}

    public static IssueResponse fromEntity(ReportedIssue issue) {
        return fromEntity(issue, null);
    }

    public static IssueResponse fromEntity(ReportedIssue issue, ResolutionRating rating) {
        IssueResponse response = new IssueResponse();
        response.setId(issue.getId());
        response.setDescription(issue.getDescription());
        response.setStatus(issue.getStatus() != null ? issue.getStatus().name() : null);
        response.setCreatedAt(issue.getCreatedAt());
        response.setPhotoUrl(issue.getPhotoUrl());
        if(rating != null) {
            response.setRated(true);
            response.setStars(rating.getStars());
            response.setFeedback(rating.getFeedbackText());
        }else{
            response.setRated(false);
            response.setStars(0);
        }
        if (issue.getAssignedWorker() != null) {
            response.setAssignedWorkerEmail(issue.getAssignedWorker().getEmail());
        }
        Location location = issue.getLocation();
        if (location != null) {
            response.setLongitude(location.getX());
            response.setLatitude(location.getY());
            response.setAddress(location.getAddress());
        }

        if (issue.getAuthor() != null) {
            response.setAuthorEmail(issue.getAuthor().getEmail());
        }

        if (issue.getIssueCategory() != null) {
            response.setCategoryId(issue.getIssueCategory().getId());
        }

        return response;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getLatitude() {
        return latitude;
    }
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }
    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setAssignedWorkerEmail(String assignedWorkerEmail) {
        this.assignedWorkerEmail = assignedWorkerEmail;
    }
    public String getAssignedWorkerEmail() {
        return assignedWorkerEmail;
    }

    public boolean isRated() { return isRated; }
    public void setRated(boolean rated) { isRated = rated; }

    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

}
