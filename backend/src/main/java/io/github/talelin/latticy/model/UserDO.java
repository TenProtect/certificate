package io.github.talelin.latticy.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * @author pedro@TaleLin
 * @author Juzi@TaleLin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("lin_user")
@EqualsAndHashCode(callSuper = true)
public class UserDO extends BaseModel implements Serializable {

    private static final long serialVersionUID = -1463999384554707735L;

    /**
     * 用户名，唯一
     */
    private String username;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 头像url
     */
    private String avatar;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 用户身份信息列表
     */
    @TableField(exist = false)
    private List<UserIdentityDO> identities;

    /**
     * 获取支付宝用户ID
     */
    public String getAlipayUserId() {
        if (identities == null) {
            return null;
        }
        return identities.stream()
                .filter(identity -> "ALIPAY".equals(identity.getIdentityType()))
                .map(UserIdentityDO::getIdentifier)
                .findFirst()
                .orElse(null);
    }
}
