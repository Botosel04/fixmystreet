package com.smartcity.fixmystreet.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {

    private Double x;
    private Double y;
    private String address;

    public Location() {}

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}