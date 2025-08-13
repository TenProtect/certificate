package com.example.backend.service;

import com.example.backend.domain.License;
import com.example.backend.exception.BusinessException;
import com.example.backend.repository.LicenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LicenseService {
    private final LicenseRepository licenseRepository;

    public LicenseService(LicenseRepository licenseRepository) {
        this.licenseRepository = licenseRepository;
    }

    public List<License> listAll() {
        return licenseRepository.findAll();
    }

    public License create(License license) {
        return licenseRepository.save(license);
    }

    public License update(License license) {
        if (licenseRepository.findById(license.getId()) == null) {
            throw new BusinessException(20001, "license not found");
        }
        return licenseRepository.save(license);
    }

    public void delete(Long id) {
        if (licenseRepository.findById(id) == null) {
            throw new BusinessException(20001, "license not found");
        }
        licenseRepository.delete(id);
    }
}
