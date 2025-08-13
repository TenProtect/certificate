package io.github.talelin.latticy.dto;

import io.github.talelin.autoconfigure.validator.Enum;
import io.github.talelin.latticy.common.enumeration.OnlineOrNotEnum;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

@Data
public class MerchantDTO {
    @NotBlank
    @Length(min = 1, max = 100)
    private String name;

    private String logo;

    private String description;

    @Enum(allowNull = true, target = OnlineOrNotEnum.class)
    private Integer online;
}
