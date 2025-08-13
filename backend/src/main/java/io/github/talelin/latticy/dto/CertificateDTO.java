package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CertificateDTO {
    @NotBlank
    private String name;
    private String badge;
    private Boolean hasReceipt;
    private String printSize;
    private String pixelSize;
    private String resolution;
    private Boolean saveElectronicPhoto;
    private Boolean printLayout;
    private String bgColor;
    private String imageFormat;
    private String imageFileSize;
    private String requirements;
}
