package io.github.talelin.latticy.controller.v1;

import io.github.talelin.latticy.common.enumeration.AsyncNotifyType;
import io.github.talelin.latticy.vo.UnifyResponseVO;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Receive external asynchronous notification callbacks.
 * <p>
 * This endpoint is open and does not require authentication.
 * It currently supports common notification types but does not process
 * them yet. A unified success response is returned.
 */
@RestController
@RequestMapping("/v1/notify")
@Validated
public class AsyncNotifyController {

    @PostMapping("/{type}")
    public UnifyResponseVO<String> receive(@PathVariable("type") AsyncNotifyType type,
                                           @RequestBody(required = false) String body) {
        // TODO: handle different notification types
        switch (type) {
            case ALIPAY:
            case WECHAT_PAY:
            case UNION_PAY:
            case SMS:
            case EMAIL:
            case LOGISTICS:
            default:
                break;
        }
        return new UnifyResponseVO<>("ok");
    }
}
