package io.github.talelin.latticy.model;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@TableName("certificate")
@EqualsAndHashCode(callSuper = true)
public class CertificateDO extends BaseModel implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private Boolean hasReceipt;
    private String printSize;
    private String pixelSize;
    private String resolution;
    private String bgColor;
    private String imageFormat;
    private String imageFileSize;
    private String requirements;
    private BigDecimal price;
}
