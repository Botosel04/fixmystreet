package com.smartcity.fixmystreet.repository;

import com.smartcity.fixmystreet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository  extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
