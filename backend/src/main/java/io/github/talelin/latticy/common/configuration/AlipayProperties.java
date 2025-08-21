package io.github.talelin.latticy.common.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "alipay")
@Data
public class AlipayProperties {

    private String appId;

    private String appPrivateKey;

    private String alipayPublicKey;

    private String gateway;

    private String notifyUrl;

    /**
     * Products for content risk detection
     */
    private String riskProducts;

    /**
     * Channel identifier for content risk detection
     */
    private String riskChannel;
}

