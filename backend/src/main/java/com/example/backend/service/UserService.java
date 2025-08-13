package com.example.backend.service;

import com.example.backend.domain.User;
import com.example.backend.exception.BusinessException;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.PasswordUtil;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new BusinessException(10002, "invalid credentials");
        }
        String hashed = PasswordUtil.hash(password);
        if (!hashed.equals(user.getPasswordHash())) {
            throw new BusinessException(10002, "invalid credentials");
        }
        return user;
    }
}
