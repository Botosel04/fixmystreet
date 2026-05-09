package com.smartcity.fixmystreet;

import com.smartcity.fixmystreet.dto.RegisterRequest;
import com.smartcity.fixmystreet.model.User;
import com.smartcity.fixmystreet.repository.UserRepository;
import com.smartcity.fixmystreet.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServiceTest {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setup(){
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void registerUser_success(){
        RegisterRequest req = new RegisterRequest();
        req.setUserName("Alice");
        req.setEmail("alice@example.com");
        req.setPassword("password123");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(null);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("hashedPassword");

        User saved = new User();
        saved.setId(1L);
        saved.setEmail(req.getEmail());
        saved.setUserName(req.getUserName());
        saved.setPassword("hashedPassword");

        when(userRepository.save(any(User.class))).thenReturn(saved);

        User result = userService.registerUser(req);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("alice@example.com", result.getEmail());

        verify(passwordEncoder).encode(req.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_duplicateEmail_throws(){
        RegisterRequest req = new RegisterRequest();
        req.setUserName("Bob");
        req.setEmail("taken@example.com");
        req.setPassword("password123");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(new User());
        assertThrows(RuntimeException.class, () -> userService.registerUser(req));

    }
}