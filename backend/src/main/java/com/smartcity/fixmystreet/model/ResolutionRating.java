package com.smartcity.fixmystreet.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resolution_ratings")
public class ResolutionRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name= "issue_id", nullable = false)
    private ReportedIssue reportedIssue;

    @Column(nullable = false)
    private int stars;

    private String feedbackText;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public ReportedIssue getReportedIssue() {
        return reportedIssue;
    }
    public void setReportedIssue(ReportedIssue reportedIssue) {
        this.reportedIssue = reportedIssue;
    }

    public int getStars() {
        return stars;
    }
    public void setStars(int stars) {
        this.stars = stars;
    }

    public String getFeedbackText() {
        return feedbackText;
    }
    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
