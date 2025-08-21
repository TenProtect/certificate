package io.github.talelin.latticy.controller.v1;

import com.alipay.api.AlipayApiException;
import io.github.talelin.latticy.dto.ContentDetectDTO;
import io.github.talelin.latticy.service.ContentRiskService;
import io.github.talelin.latticy.vo.UnifyResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/mini/risk")
@Validated
public class ContentRiskController {

    @Autowired
    private ContentRiskService contentRiskService;

    @PostMapping("/detect")
    public UnifyResponseVO<Map<String, Boolean>> detect(@RequestBody @Validated ContentDetectDTO dto) throws AlipayApiException {
        boolean pass = contentRiskService.detect(dto.getContentType(), dto.getData());
        Map<String, Boolean> result = new HashMap<>();
        result.put("pass", pass);
        return new UnifyResponseVO<>(result);
    }
}

