package com.example.backend.repository;

import com.example.backend.domain.User;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Repository
public class InMemoryUserRepository implements UserRepository {
    private final Map<String, User> users = new HashMap<>();

    @PostConstruct
    public void init() {
        // password: admin123 (SHA-256)
        users.put("admin", new User(1L, "admin", "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"));
    }

    @Override
    public User findByUsername(String username) {
        return users.get(username);
    }
}
