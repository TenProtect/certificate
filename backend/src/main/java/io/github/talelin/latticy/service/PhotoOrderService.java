package io.github.talelin.latticy.service;

import com.alipay.api.AlipayApiException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import io.github.talelin.autoconfigure.exception.NotFoundException;
import io.github.talelin.autoconfigure.exception.ParameterException;
import io.github.talelin.latticy.common.enumeration.PhotoOrderStatus;
import io.github.talelin.latticy.dto.CreatePhotoOrderDTO;
import io.github.talelin.latticy.dto.ResubmitPhotoDTO;
import io.github.talelin.latticy.dto.RejectPhotoOrderDTO;
import io.github.talelin.latticy.dto.ReviewPhotoOrderDTO;
import io.github.talelin.latticy.mapper.PhotoOrderMapper;
import io.github.talelin.latticy.model.PhotoOrderDO;
import io.github.talelin.latticy.model.UserDO;
import io.github.talelin.latticy.common.LocalUser;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import cn.hutool.core.util.StrUtil;

@Service
public class PhotoOrderService extends ServiceImpl<PhotoOrderMapper, PhotoOrderDO> {

    @Autowired
    private AlipayService alipayService;

    public Map<String, Object> createOrder(CreatePhotoOrderDTO dto) throws AlipayApiException {
        PhotoOrderDO order = new PhotoOrderDO();
        BeanUtils.copyProperties(dto, order);
        order.setOrderNo(String.valueOf(System.currentTimeMillis()));
        order.setStatus(PhotoOrderStatus.UNPAID.getValue());
        order.setUserId(LocalUser.getLocalUser().getId());
        this.save(order);

        // 从当前登录用户直接获取支付宝用户ID
        UserDO currentUser = LocalUser.getLocalUser();
        String buyerId = currentUser.getAlipayUserId();
        if (buyerId == null) {
            throw new AlipayApiException("当前用户没有绑定支付宝账号");
        }

        String tradeNo = alipayService.createTrade(order.getOrderNo(), dto.getAmount(), dto.getDocumentName(), buyerId);

        order.setTradeNo(tradeNo);
        this.updateById(order);

        Map<String, Object> res = new HashMap<>();
        res.put("orderId", order.getId());
        res.put("tradeNo", tradeNo);
        res.put("orderNo", order.getOrderNo());
        return res;
    }

    public List<PhotoOrderDO> listMine(Integer status) {
        Integer uid = LocalUser.getLocalUser().getId();
        LambdaQueryWrapper<PhotoOrderDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PhotoOrderDO::getUserId, uid);
        if (status != null) {
            wrapper.eq(PhotoOrderDO::getStatus, status);
        }
        wrapper.orderByDesc(PhotoOrderDO::getId);
        return this.list(wrapper);
    }

    public List<PhotoOrderDO> listAll(Integer status) {
        LambdaQueryWrapper<PhotoOrderDO> wrapper = new LambdaQueryWrapper<>();
        if (status != null) {
            wrapper.eq(PhotoOrderDO::getStatus, status);
        }
        wrapper.orderByDesc(PhotoOrderDO::getId);
        return this.list(wrapper);
    }

    public PhotoOrderDO getMineById(Long id) {
        PhotoOrderDO order = this.getById(id);
        if (order == null || !order.getUserId().equals(LocalUser.getLocalUser().getId())) {
            throw new NotFoundException(110000);
        }
        return order;
    }

    public void resubmit(Long id, ResubmitPhotoDTO dto) {
        PhotoOrderDO order = this.getById(id);
        if (order == null) {
            throw new NotFoundException(110000);
        }
        order.setOriginalPhoto(dto.getOriginalPhoto());
        order.setRejectReason(null);
        order.setStatus(PhotoOrderStatus.PAID.getValue());
        this.updateById(order);
    }

    public void reject(Long id, RejectPhotoOrderDTO dto) {
        PhotoOrderDO order = this.getById(id);
        if (order == null) {
            throw new NotFoundException(110000);
        }
        order.setRejectReason(dto.getReason());
        order.setStatus(PhotoOrderStatus.REJECTED.getValue());
        this.updateById(order);
    }

    public void review(Long id, ReviewPhotoOrderDTO dto) {
        PhotoOrderDO order = this.getById(id);
        if (order == null) {
            throw new NotFoundException(110000);
        }

        boolean requireLayout = false;
        if (StrUtil.isNotBlank(order.getCertificateSnapshot())) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> snapshot = mapper.readValue(order.getCertificateSnapshot(), new TypeReference<Map<String, Object>>() {
                });
                Object flag = snapshot.get("printLayout");
                if (flag instanceof Boolean) {
                    requireLayout = (Boolean) flag;
                }
            } catch (IOException ignored) {
            }
        }

        if (requireLayout && StrUtil.isBlank(dto.getLayoutPhoto())) {
            throw new ParameterException(10001);
        }

        order.setStandardPhoto(dto.getStandardPhoto());
        order.setLayoutPhoto(dto.getLayoutPhoto());
        order.setReceiptPhoto(dto.getReceiptPhoto());
        order.setStatus(PhotoOrderStatus.COMPLETED.getValue());
        this.updateById(order);
    }

    public Map<String, String> getPhotos(Long id) {
        PhotoOrderDO order = this.getById(id);
        if (order == null) {
            throw new NotFoundException(110000);
        }
        Map<String, String> res = new HashMap<>();
        res.put("standardPhoto", order.getStandardPhoto());
        res.put("layoutPhoto", order.getLayoutPhoto());
        res.put("receiptPhoto", order.getReceiptPhoto());
        return res;
    }

    public void markPaid(String orderNo) {
        LambdaQueryWrapper<PhotoOrderDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PhotoOrderDO::getOrderNo, orderNo);
        PhotoOrderDO order = this.getOne(wrapper);
        if (order != null && order.getStatus() == PhotoOrderStatus.UNPAID.getValue()) {
            order.setStatus(PhotoOrderStatus.PAID.getValue());
            this.updateById(order);
        }
    }
}
