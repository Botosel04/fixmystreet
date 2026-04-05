package com.smartcity.fixmystreet.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {
    private double x;
    private double y;
    private String address;

    public Location() {}

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}