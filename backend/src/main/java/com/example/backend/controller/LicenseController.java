package com.example.backend.controller;

import com.example.backend.domain.ApiResponse;
import com.example.backend.domain.License;
import com.example.backend.service.LicenseService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import java.util.List;

@RestController
@RequestMapping("/api/licenses")
@Validated
public class LicenseController {
    private final LicenseService licenseService;

    public LicenseController(LicenseService licenseService) {
        this.licenseService = licenseService;
    }

    public static class LicenseRequest {
        @NotBlank
        private String name;
        private String badge;
        @NotBlank
        private String printSize;
        @NotBlank
        private String pixelSize;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getBadge() {
            return badge;
        }

        public void setBadge(String badge) {
            this.badge = badge;
        }

        public String getPrintSize() {
            return printSize;
        }

        public void setPrintSize(String printSize) {
            this.printSize = printSize;
        }

        public String getPixelSize() {
            return pixelSize;
        }

        public void setPixelSize(String pixelSize) {
            this.pixelSize = pixelSize;
        }
    }

    @GetMapping
    public ApiResponse<List<License>> list() {
        return ApiResponse.success(licenseService.listAll());
    }

    @PostMapping
    public ApiResponse<License> create(@RequestBody @Validated LicenseRequest req) {
        License license = new License(null, req.getName(), req.getBadge(), req.getPrintSize(), req.getPixelSize());
        return ApiResponse.success(licenseService.create(license));
    }

    @PutMapping("/{id}")
    public ApiResponse<License> update(@PathVariable Long id, @RequestBody @Validated LicenseRequest req) {
        License license = new License(id, req.getName(), req.getBadge(), req.getPrintSize(), req.getPixelSize());
        return ApiResponse.success(licenseService.update(license));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        licenseService.delete(id);
        return ApiResponse.success(null);
    }
}
