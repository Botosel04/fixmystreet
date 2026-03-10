package com.smartcity.fixmystreet.model;

import java.util.Date;

public class ReportIssue {
    private Location location;
    private Date date;
    private String name;
    private String description;
    private String photoUrl;
    private String type;

    public ReportIssue(Location location, Date date, String name, String description, String photoUrl, String type) {
        this.location = location;
        this.date = date;
        this.name = name;
        this.description = description;
        this.photoUrl = photoUrl;
        this.type = type;
    }

    public String getLocationAdress()
    {
        return location.getStreetAddress();
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getType(){
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

}
