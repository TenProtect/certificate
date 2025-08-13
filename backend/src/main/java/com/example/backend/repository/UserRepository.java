package com.example.backend.repository;

import com.example.backend.domain.User;

public interface UserRepository {
    User findByUsername(String username);
}
