package com.smartcity.fixmystreet.controller;

import com.smartcity.fixmystreet.dto.AuthResponse;
import com.smartcity.fixmystreet.dto.LoginRequest;
import com.smartcity.fixmystreet.dto.RegisterRequest;
import com.smartcity.fixmystreet.dto.UserResponse;
import com.smartcity.fixmystreet.model.User;
import com.smartcity.fixmystreet.service.JwtService;
import com.smartcity.fixmystreet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;
    @Autowired
    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Registering User: " + registerRequest.getEmail());
            User newUser = userService.registerUser(registerRequest);
            return ResponseEntity.ok(UserResponse.fromUser(newUser));
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(null);

        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        try{
            User loggedinUser = userService.loginUser(loginRequest);
            String token = jwtService.generateToken(loggedinUser);
            AuthResponse response = new AuthResponse(token, loggedinUser.getEmail(), loggedinUser.getRole().name());
            System.out.println("User successfully logged in : " + loggedinUser.getEmail());
            return ResponseEntity.ok(response);
        }catch (RuntimeException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

}
