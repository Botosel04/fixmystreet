package com.smartcity.fixmystreet.model;

public class Location {
    private double latitude;
    private double longitude;
    private String streetAddress;

    public Location(double latitude, double longitude, String streetAddress){
        this.latitude = latitude;
        this.longitude = longitude;
        this.streetAddress = streetAddress;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getStreetAddress() {
        return streetAddress;
    }
}
