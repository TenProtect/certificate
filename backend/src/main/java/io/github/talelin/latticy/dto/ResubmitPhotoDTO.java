package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ResubmitPhotoDTO {

    @NotBlank
    private String originalPhoto;
}

