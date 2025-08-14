package io.github.talelin.latticy.controller.v1;

import com.alipay.api.AlipayApiException;
import io.github.talelin.core.annotation.GroupRequired;
import io.github.talelin.core.annotation.LoginRequired;
import io.github.talelin.core.annotation.PermissionModule;
import io.github.talelin.latticy.dto.CreatePhotoOrderDTO;
import io.github.talelin.latticy.dto.ResubmitPhotoDTO;
import io.github.talelin.latticy.dto.RejectPhotoOrderDTO;
import io.github.talelin.latticy.dto.ReviewPhotoOrderDTO;
import io.github.talelin.latticy.service.PhotoOrderService;
import io.github.talelin.latticy.vo.UpdatedVO;
import io.github.talelin.latticy.common.util.ResponseUtil;
import io.github.talelin.latticy.vo.UnifyResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Positive;
import java.util.Map;

@RestController
@RequestMapping("/v1/mini/order")
@Validated
@PermissionModule("证照订单")
public class PhotoOrderController {

    @Autowired
    private PhotoOrderService photoOrderService;

    @PostMapping("")
    @LoginRequired
    public UnifyResponseVO<Map<String, Object>> create(@RequestBody @Validated CreatePhotoOrderDTO dto) throws AlipayApiException {
        Map<String, Object> data = photoOrderService.createOrder(dto);
        return ResponseUtil.generateCreatedResponse(0, data);
    }

    @PostMapping("/{id}/resubmit")
    @LoginRequired
    public UpdatedVO resubmit(@PathVariable("id") @Positive Long id, @RequestBody @Validated ResubmitPhotoDTO dto) {
        photoOrderService.resubmit(id, dto);
        return new UpdatedVO();
    }

    @PostMapping("/{id}/reject")
    @GroupRequired
    public UpdatedVO reject(@PathVariable("id") @Positive Long id, @RequestBody @Validated RejectPhotoOrderDTO dto) {
        photoOrderService.reject(id, dto);
        return new UpdatedVO();
    }

    @PostMapping("/{id}/review")
    @GroupRequired
    public UpdatedVO review(@PathVariable("id") @Positive Long id, @RequestBody @Validated ReviewPhotoOrderDTO dto) {
        photoOrderService.review(id, dto);
        return new UpdatedVO();
    }

    @GetMapping("/{id}/photos")
    @LoginRequired
    public Map<String, String> photos(@PathVariable("id") @Positive Long id) {
        return photoOrderService.getPhotos(id);
    }
}

