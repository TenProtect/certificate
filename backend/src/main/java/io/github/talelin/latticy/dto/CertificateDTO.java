package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Data
public class CertificateDTO {
    @NotBlank
    private String name;
    private String category;
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
    private BigDecimal price;
}
