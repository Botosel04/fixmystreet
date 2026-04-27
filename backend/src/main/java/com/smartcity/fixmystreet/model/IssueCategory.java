package com.smartcity.fixmystreet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "issue_category")
public class IssueCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private  PriorityLevel priorityLevel;

    public IssueCategory(){}

    public IssueCategory(String name, PriorityLevel priorityLevel){
        this.name = name;
        this.priorityLevel = priorityLevel;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public PriorityLevel getPriorityLevel() {
        return priorityLevel;
    }
    public void setPriorityLevel(PriorityLevel priorityLevel) {
        this.priorityLevel = priorityLevel;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}
