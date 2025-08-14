package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReviewPhotoOrderDTO {

    @NotBlank
    private String standardPhoto;

    @NotBlank
    private String layoutPhoto;

    private String receiptPhoto;
}

