package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReviewPhotoOrderDTO {

    private String standardPhoto;

    private String layoutPhoto;

    private String receiptPhoto;
}

