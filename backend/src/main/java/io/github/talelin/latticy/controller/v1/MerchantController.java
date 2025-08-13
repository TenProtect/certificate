package io.github.talelin.latticy.controller.v1;

import com.baomidou.mybatisplus.core.metadata.IPage;
import io.github.talelin.core.annotation.GroupRequired;
import io.github.talelin.core.annotation.LoginRequired;
import io.github.talelin.core.annotation.PermissionMeta;
import io.github.talelin.core.annotation.PermissionModule;
import io.github.talelin.latticy.common.util.PageUtil;
import io.github.talelin.latticy.dto.MerchantDTO;
import io.github.talelin.latticy.model.MerchantDO;
import io.github.talelin.latticy.service.MerchantService;
import io.github.talelin.latticy.vo.CreatedVO;
import io.github.talelin.latticy.vo.DeletedVO;
import io.github.talelin.latticy.vo.PageResponseVO;
import io.github.talelin.latticy.vo.UpdatedVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Positive;

@RestController
@RequestMapping("/v1/merchant")
@Validated
@PermissionModule("商家")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @PostMapping("")
    @PermissionMeta("创建商家")
    @GroupRequired
    public CreatedVO create(@RequestBody @Validated MerchantDTO dto) {
        MerchantDO merchant = new MerchantDO();
        BeanUtils.copyProperties(dto, merchant);
        merchantService.save(merchant);
        return new CreatedVO();
    }

    @PutMapping("/{id}")
    @PermissionMeta("更新商家")
    public UpdatedVO update(@RequestBody @Validated MerchantDTO dto,
                            @PathVariable @Positive(message = "{id.positive}") Integer id) {
        merchantService.update(dto, id);
        return new UpdatedVO();
    }

    @DeleteMapping("/{id}")
    @PermissionMeta("删除商家")
    @GroupRequired
    public DeletedVO delete(@PathVariable @Positive(message = "{id.positive}") Integer id) {
        merchantService.delete(id);
        return new DeletedVO();
    }

    @GetMapping("/{id}")
    @LoginRequired
    public MerchantDO get(@PathVariable @Positive(message = "{id.positive}") Integer id) {
        return merchantService.getOrThrow(id);
    }

    @GetMapping("/page")
    @LoginRequired
    public PageResponseVO<MerchantDO> page(
            @RequestParam(name = "count", required = false, defaultValue = "10")
            @Min(value = 1, message = "{page.count.min}")
            @Max(value = 30, message = "{page.count.max}") Integer count,
            @RequestParam(name = "page", required = false, defaultValue = "0")
            @Min(value = 0, message = "{page.number.min}") Integer page
    ) {
        IPage<MerchantDO> paging = merchantService.page(count, page);
        return PageUtil.build(paging);
    }

    @GetMapping("/list")
    @LoginRequired
    public List<MerchantDO> list() {
        return merchantService.list();
    }
}
