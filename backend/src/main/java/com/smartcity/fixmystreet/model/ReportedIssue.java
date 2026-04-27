package com.smartcity.fixmystreet.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "reported_issue")
public class ReportedIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = true)
    private User author;

    @Column(nullable = false)
    private String issueType;

    @Column(nullable = false, length = 1000)
    private String description;

    @Embedded
    private Location location;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private IssueStatus status = IssueStatus.BACKLOG;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private String name;

    private String photoUrl;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "category_id", nullable = false)
   private IssueCategory issueCategory;

    private Integer estimatedHours;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private User assigned_worker;

    public ReportedIssue(){}

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
    public Location getLocation() {
        return location;
    }
    public void setLocation(Location location) {
        this.location = location;
    }
    public IssueStatus getStatus() {
        return status;
    }
    public void setStatus(IssueStatus status) {
        this.status = status;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPhotoUrl() {
        return photoUrl;
    }
    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    public IssueCategory getType() {
        return this.issueCategory;
    }
    public void setIssueCategory(IssueCategory issueCategory) {
        this.issueCategory = issueCategory;
    }
    public Integer getEstimatedHours() {
        return estimatedHours;
    }
    public void setEstimatedHours(Integer estimatedHours) {
        this.estimatedHours = estimatedHours;
    }
    public User getAssignedWorker() {
        return assigned_worker;
    }
    public void setAssignedWorker(User worker) {
        this.assigned_worker = worker;
    }
    public User getAuthor(){return this.author;}
    public void setAuthor(User author){this.author = author;}
}
