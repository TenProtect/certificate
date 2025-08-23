package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class CreatePhotoOrderDTO {

    @NotBlank
    private String documentName;

    @NotBlank
    private String location;

    @NotNull
    private BigDecimal amount;

    @NotBlank
    private String originalPhoto;

    @NotBlank
    private String certificateSnapshot;

    private String cardNo;

    private String remark;
}

