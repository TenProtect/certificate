package io.github.talelin.latticy.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import io.github.talelin.autoconfigure.exception.NotFoundException;
import io.github.talelin.latticy.common.mybatis.Page;
import io.github.talelin.latticy.dto.MerchantDTO;
import io.github.talelin.latticy.mapper.MerchantMapper;
import io.github.talelin.latticy.model.MerchantDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class MerchantService extends ServiceImpl<MerchantMapper, MerchantDO> {

    public void update(MerchantDTO dto, Integer id) {
        MerchantDO merchant = this.getById(id);
        if (merchant == null) {
            throw new NotFoundException(120000);
        }
        BeanUtils.copyProperties(dto, merchant);
        this.updateById(merchant);
    }

    public void delete(Integer id) {
        MerchantDO merchant = this.getById(id);
        if (merchant == null) {
            throw new NotFoundException(120000);
        }
        this.getBaseMapper().deleteById(id);
    }

    public MerchantDO getOrThrow(Integer id) {
        MerchantDO merchant = this.getById(id);
        if (merchant == null) {
            throw new NotFoundException(120000);
        }
        return merchant;
    }

    public IPage<MerchantDO> page(Integer count, Integer page) {
        Page<MerchantDO> pager = new Page<>(page, count);
        return this.getBaseMapper().selectPage(pager, null);
    }
}
