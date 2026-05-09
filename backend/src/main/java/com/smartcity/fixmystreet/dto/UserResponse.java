package com.smartcity.fixmystreet.dto;

import com.smartcity.fixmystreet.model.Role;
import com.smartcity.fixmystreet.model.User;

public class UserResponse {
    private Long id;
    private String userName;
    private String email;
    private Role role;

    public UserResponse(Long id, String userName, String email, Role role) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.role = role;
    }

    public static UserResponse fromUser(User user) {
        return new UserResponse(user.getId(), user.getUserName(), user.getEmail(), user.getRole());
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
}
