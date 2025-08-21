package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * DTO for content risk detection
 */
@Data
public class ContentDetectDTO {

    /** Content type: TEXT or PICTURE */
    @NotBlank
    private String contentType;

    /** Content to be checked (text or image URL) */
    @NotBlank
    private String data;
}

