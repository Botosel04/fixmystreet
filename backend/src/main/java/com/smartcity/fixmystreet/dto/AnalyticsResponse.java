package com.smartcity.fixmystreet.dto;

public class AnalyticsResponse {
    private long totalReported;
    private long totalResolved;
    private double resolutionRate;

    public AnalyticsResponse(){}

    public long getTotalReported() {
        return totalReported;
    }
    public void setTotalReported(long totalReported) {
        this.totalReported = totalReported;
    }

    public long getTotalResolved() {
        return totalResolved;
    }
    public void setTotalResolved(long totalResolved) {
        this.totalResolved = totalResolved;
    }

    public double getResolutionRate() {
        return resolutionRate;
    }
    public void setResolutionRate(double resolutionRate) {
        this.resolutionRate = resolutionRate;
    }
}
