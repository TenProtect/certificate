package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RejectPhotoOrderDTO {

    @NotBlank
    private String reason;
}

