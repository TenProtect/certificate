package com.example.backend.repository;

import com.example.backend.domain.License;

import java.util.List;

public interface LicenseRepository {
    List<License> findAll();
    License findById(Long id);
    License save(License license);
    void delete(Long id);
}
