package io.github.talelin.latticy.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class AlipayNotifyTestDTO {
    @NotBlank
    @JsonProperty("out_trade_no")
    private String outTradeNo;

    @JsonProperty("trade_status")
    private String tradeStatus;
}
