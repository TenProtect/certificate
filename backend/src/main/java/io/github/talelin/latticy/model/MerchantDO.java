package io.github.talelin.latticy.model;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Merchant model
 */
@Data
@TableName("merchant")
@EqualsAndHashCode(callSuper = true)
public class MerchantDO extends BaseModel {

    private String name;

    private String logo;

    private String description;

    private Integer online;
}
