package com.smartcity.fixmystreet.controller;

import com.smartcity.fixmystreet.dto.RegisterRequest;
import com.smartcity.fixmystreet.model.User;
import com.smartcity.fixmystreet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/auth")
public class AuthController {
    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Registering User: " + registerRequest.getEmail());
            User newUser = userService.registerUser(registerRequest);
            return ResponseEntity.ok(newUser);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());

        }
    }

}

