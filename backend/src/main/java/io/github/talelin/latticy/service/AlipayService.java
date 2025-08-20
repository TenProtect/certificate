package io.github.talelin.latticy.service;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradeCreateRequest;
import com.alipay.api.request.AlipaySystemOauthTokenRequest;
import com.alipay.api.response.AlipayTradeCreateResponse;
import com.alipay.api.response.AlipaySystemOauthTokenResponse;
import com.alipay.api.internal.util.AlipaySignature;
import io.github.talelin.latticy.common.configuration.AlipayProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class AlipayService {

    @Autowired
    private AlipayProperties properties;

    private AlipayClient buildClient() {
        return new DefaultAlipayClient(
                properties.getGateway(),
                properties.getAppId(),
                properties.getAppPrivateKey(),
                "json",
                "UTF-8",
                properties.getAlipayPublicKey(),
                "RSA2");
    }

    public String createTrade(String outTradeNo, BigDecimal amount, String subject, String buyerOpenId) throws AlipayApiException {
        AlipayClient client = buildClient();

        AlipayTradeCreateRequest request = new AlipayTradeCreateRequest();
        request.setNotifyUrl(properties.getNotifyUrl());

        // 关键：使用 buyer_open_id，而不是 buyer_id
        String bizContent = String.format(
                "{\"out_trade_no\":\"%s\",\"total_amount\":\"%s\",\"subject\":\"%s\",\"buyer_open_id\":\"%s\"}",
                outTradeNo, amount.toPlainString(), subject, buyerOpenId
        );
        request.setBizContent(bizContent);

        AlipayTradeCreateResponse response = client.execute(request);
        if (response.isSuccess()) {
            return response.getTradeNo();
        }
        throw new AlipayApiException("create trade failed:" + response.getSubMsg());
    }

    public boolean verifyNotify(Map<String, String> params) throws AlipayApiException {
        return AlipaySignature.rsaCheckV1(params, properties.getAlipayPublicKey(), "UTF-8", "RSA2");
    }

    /**
     * 根据小程序 authCode 换取支付宝用户 openid
     */
    public String getUserId(String authCode) throws AlipayApiException {
        AlipayClient client = buildClient();
        AlipaySystemOauthTokenRequest request = new AlipaySystemOauthTokenRequest();
        request.setCode(authCode);
        request.setGrantType("authorization_code");
        AlipaySystemOauthTokenResponse response = client.execute(request);
        if (response.isSuccess()) {
            return response.getOpenId();
        }
        throw new AlipayApiException("exchange authCode failed:" + response.getSubMsg());
    }
}
