package io.github.talelin.latticy.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("authCode")
    @JsonAlias({"authcode", "auth_code"})
    private String authCode;

    /**
     * 用户昵称
     */
    @NotBlank(message = "nickName不能为空")
    @JsonProperty("nickName")
    @JsonAlias({"nickname", "nick_name"})
    private String nickname;

    /**
     * 用户头像
     */
    @NotBlank(message = "avatar不能为空")
    private String avatar;
}
