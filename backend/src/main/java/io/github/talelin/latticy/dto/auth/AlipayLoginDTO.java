package io.github.talelin.latticy.dto.auth;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * 支付宝登录 DTO
 */
@Data
public class AlipayLoginDTO {

    /**
     * 小程序获取到的 authCode
     */
    @NotBlank(message = "authCode不能为空")
    private String authCode;
}
