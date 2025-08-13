
package io.github.talelin.latticy.model;

import lombok.Data;
import com.baomidou.mybatisplus.annotation.TableField;

import java.util.List;

@Data
public class SpuDetailDO extends SpuDO {

    private String categoryName;

    private String sketchSpecKeyName;

    private String defaultSkuTitle;

    @TableField(exist = false)
    private String merchantName;

    private List<String> spuImgList;

    private List<String> spuDetailImgList;
}

