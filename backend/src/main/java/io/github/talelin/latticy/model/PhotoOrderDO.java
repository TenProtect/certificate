package io.github.talelin.latticy.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@TableName("photo_order")
public class PhotoOrderDO {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private String orderNo;

    private String tradeNo;

    private Integer userId;

    private String documentName;

    private String location;

    private String cardNo;

    private BigDecimal amount;

    private String originalPhoto;

    private String standardPhoto;

    private String layoutPhoto;

    private String receiptPhoto;

    private String certificateSnapshot;

    private String remark;

    private String rejectReason;

    private Integer status;

    private Date createTime;

    @TableField(update = "now()")
    private Date updateTime;

    @TableLogic
    private Date deleteTime;
}

