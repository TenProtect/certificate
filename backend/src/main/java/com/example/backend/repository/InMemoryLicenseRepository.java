package com.example.backend.repository;

import com.example.backend.domain.License;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryLicenseRepository implements LicenseRepository {
    private final Map<Long, License> store = new ConcurrentHashMap<>();
    private final AtomicLong idGen = new AtomicLong(0);

    @PostConstruct
    public void init() {
        save(new License(null, "身份证", "含回执", "26x32mm", "358x441px"));
    }

    @Override
    public List<License> findAll() {
        return new ArrayList<>(store.values());
    }

    @Override
    public License findById(Long id) {
        return store.get(id);
    }

    @Override
    public License save(License license) {
        if (license.getId() == null) {
            long id = idGen.incrementAndGet();
            license.setId(id);
        }
        store.put(license.getId(), license);
        return license;
    }

    @Override
    public void delete(Long id) {
        store.remove(id);
    }
}
