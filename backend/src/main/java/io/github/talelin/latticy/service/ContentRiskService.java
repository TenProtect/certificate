package io.github.talelin.latticy.service;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipaySecurityRiskContentSyncDetectModel;
import com.alipay.api.request.AlipaySecurityRiskContentSyncDetectRequest;
import com.alipay.api.response.AlipaySecurityRiskContentSyncDetectResponse;
import io.github.talelin.latticy.common.configuration.AlipayProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

/**
 * Service for invoking Alipay content risk detection API
 */
@Service
public class ContentRiskService {

    private static final Logger log = LoggerFactory.getLogger(ContentRiskService.class);

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

    public boolean detect(String contentType, String data) throws AlipayApiException {
        AlipayClient client = buildClient();
        String requestId = UUID.randomUUID().toString();

        AlipaySecurityRiskContentSyncDetectRequest request = new AlipaySecurityRiskContentSyncDetectRequest();
        AlipaySecurityRiskContentSyncDetectModel model = new AlipaySecurityRiskContentSyncDetectModel();
        model.setRequestId(requestId);
        model.setProducts(properties.getRiskProducts());
        model.setChannel(properties.getRiskChannel());
        model.setContentType(contentType);
        model.setDataList(Collections.singletonList(data));
        request.setBizModel(model);
        AlipaySecurityRiskContentSyncDetectResponse response = client.execute(request);
        if (!response.isSuccess()) {
            throw new AlipayApiException("content detect failed:" + response.getSubMsg());
        }
        return "pass".equalsIgnoreCase(response.getSuggestion());
    }
}
