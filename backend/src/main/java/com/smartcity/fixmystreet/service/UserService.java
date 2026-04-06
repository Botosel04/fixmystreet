package com.smartcity.fixmystreet.service;

import com.smartcity.fixmystreet.dto.RegisterRequest;
import com.smartcity.fixmystreet.model.User;
import com.smartcity.fixmystreet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(RegisterRequest request) {
        if (request.getUserName() == null || request.getUserName().isBlank()) {
            throw new RuntimeException("Username is required");
        }
        if (request.getRole() == null) {
            throw new RuntimeException("Role is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already in use");
        }

        User newUser = new User();
        newUser.setUserName(request.getUserName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        newUser.setRole(request.getRole());

        return userRepository.save(newUser);
    }

}
