package io.github.talelin.latticy.controller.v1;

import com.alipay.api.AlipayApiException;
import io.github.talelin.latticy.service.AlipayService;
import io.github.talelin.latticy.service.PhotoOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/alipay")
public class AlipayController {

    @Autowired
    private AlipayService alipayService;

    @Autowired
    private PhotoOrderService photoOrderService;

    @PostMapping("/notify")
    public String notify(HttpServletRequest request) throws AlipayApiException {
        Map<String, String[]> parameterMap = request.getParameterMap();
        Map<String, String> params = new HashMap<>();
        for (String key : parameterMap.keySet()) {
            params.put(key, String.join(",", parameterMap.get(key)));
        }
        boolean verified = alipayService.verifyNotify(params);
        if (verified && "TRADE_SUCCESS".equals(params.get("trade_status"))) {
            photoOrderService.markPaid(params.get("out_trade_no"));
            return "success";
        }
        return "failure";
    }
}
