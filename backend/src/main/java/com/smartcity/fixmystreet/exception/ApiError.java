package com.smartcity.fixmystreet.exception;

public class ApiError {
    private String message;
    private int status;
    private String path;

    public ApiError(int status, String message, String path){
        this.status = status;
        this.message = message;
        this.path = path;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }

}
