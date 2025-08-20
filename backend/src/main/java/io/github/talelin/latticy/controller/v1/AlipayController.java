package io.github.talelin.latticy.controller.v1;

import com.alipay.api.AlipayApiException;
import io.github.talelin.latticy.service.AlipayService;
import io.github.talelin.latticy.service.PhotoOrderService;
import io.github.talelin.latticy.dto.AlipayNotifyTestDTO;
import io.github.talelin.latticy.vo.UnifyResponseVO;
import io.github.talelin.autoconfigure.exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/alipay")
@Validated
public class AlipayController {

    @Autowired
    private AlipayService alipayService;

    @Autowired
    private PhotoOrderService photoOrderService;

    @Autowired
    private Environment environment;

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

    @PostMapping("/notify/test")
    public UnifyResponseVO<String> notifyTest(@RequestBody @Validated AlipayNotifyTestDTO dto) {
        String[] profiles = environment.getActiveProfiles();
        boolean dev = false;
        if (profiles != null) {
            for (String p : profiles) {
                if ("dev".equals(p)) {
                    dev = true;
                    break;
                }
            }
        }
        if (!dev) {
            throw new ForbiddenException(10003);
        }
        if ("TRADE_SUCCESS".equals(dto.getTradeStatus())) {
            photoOrderService.markPaid(dto.getOutTradeNo());
            return new UnifyResponseVO<>("success");
        }
        return new UnifyResponseVO<>("failure");
    }
}
