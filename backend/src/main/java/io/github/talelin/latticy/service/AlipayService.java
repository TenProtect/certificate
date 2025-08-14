package io.github.talelin.latticy.service;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradeCreateRequest;
import com.alipay.api.response.AlipayTradeCreateResponse;
import io.github.talelin.latticy.common.configuration.AlipayProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AlipayService {

    @Autowired
    private AlipayProperties properties;

    public String createTrade(String outTradeNo, BigDecimal amount, String subject) throws AlipayApiException {
        AlipayClient client = new DefaultAlipayClient(
                properties.getGateway(),
                properties.getAppId(),
                properties.getAppPrivateKey(),
                "json",
                "UTF-8",
                properties.getAlipayPublicKey(),
                "RSA2");

        AlipayTradeCreateRequest request = new AlipayTradeCreateRequest();
        request.setNotifyUrl(properties.getNotifyUrl());
        String bizContent = String.format("{\"out_trade_no\":\"%s\",\"total_amount\":\"%s\",\"subject\":\"%s\"}",
                outTradeNo, amount.toPlainString(), subject);
        request.setBizContent(bizContent);
        AlipayTradeCreateResponse response = client.execute(request);
        if (response.isSuccess()) {
            return response.getTradeNo();
        }
        throw new AlipayApiException("create trade failed:" + response.getSubMsg());
    }
}

