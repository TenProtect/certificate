package io.github.talelin.latticy.controller.v1;

import com.alipay.api.AlipayApiException;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import io.github.talelin.core.annotation.RefreshRequired;
import io.github.talelin.core.annotation.LoginRequired;
import io.github.talelin.core.token.DoubleJWT;
import io.github.talelin.core.token.Tokens;
import io.github.talelin.latticy.common.constant.IdentityConstant;
import io.github.talelin.latticy.common.LocalUser;
import io.github.talelin.latticy.dto.auth.AlipayLoginDTO;
import io.github.talelin.latticy.model.UserDO;
import io.github.talelin.latticy.model.UserIdentityDO;
import io.github.talelin.latticy.service.AlipayService;
import io.github.talelin.latticy.service.UserIdentityService;
import io.github.talelin.latticy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/mini/auth")
@Validated
public class AuthController {

    @Autowired
    private AlipayService alipayService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserIdentityService userIdentityService;

    @Autowired
    private DoubleJWT jwt;

    @PostMapping("/alipay")
    public Map<String, Object> alipayLogin(@RequestBody AlipayLoginDTO dto) throws AlipayApiException {
        String alipayUserId = alipayService.getUserId(dto.getAuthCode());
        QueryWrapper<UserIdentityDO> wrapper = new QueryWrapper<>();
        wrapper.lambda()
                .eq(UserIdentityDO::getIdentityType, IdentityConstant.ALIPAY_IDENTITY)
                .eq(UserIdentityDO::getIdentifier, alipayUserId);
        UserIdentityDO identity = userIdentityService.getOne(wrapper);
        UserDO user;
        if (identity == null) {
            user = UserDO.builder()
                    .username("alipay_" + alipayUserId)
                    .nickname(dto.getNickname())
                    .avatar(dto.getAvatar())
                    .build();
            userService.save(user);
            userIdentityService.createIdentity(user.getId(), IdentityConstant.ALIPAY_IDENTITY, alipayUserId, "");
        } else {
            user = userService.getById(identity.getUserId());
            user.setNickname(dto.getNickname());
            user.setAvatar(dto.getAvatar());
            userService.updateById(user);
        }

        // 加载用户的身份信息
        QueryWrapper<UserIdentityDO> identityWrapper = new QueryWrapper<>();
        identityWrapper.lambda().eq(UserIdentityDO::getUserId, user.getId());
        user.setIdentities(userIdentityService.list(identityWrapper));

        Tokens tokens = jwt.generateTokens(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", tokens.getAccessToken());
        data.put("refreshToken", tokens.getRefreshToken());
        Map<String, Object> res = new HashMap<>();
        res.put("code", 0);
        res.put("message", "ok");
        res.put("data", data);
        return res;
    }

    @GetMapping("/refresh")
    @RefreshRequired
    public Map<String, Object> refresh() {
        UserDO user = LocalUser.getLocalUser();
        Tokens tokens = jwt.generateTokens(user.getId());
        Map<String, Object> data = new HashMap<>();
        data.put("token", tokens.getAccessToken());
        data.put("refreshToken", tokens.getRefreshToken());
        Map<String, Object> res = new HashMap<>();
        res.put("code", 0);
        res.put("message", "ok");
        res.put("data", data);
        return res;
    }

    @GetMapping("/heartbeat")
    @LoginRequired
    public Map<String, Object> heartbeat() {
        Map<String, Object> res = new HashMap<>();
        res.put("code", 0);
        res.put("message", "ok");
        res.put("data", new HashMap<>());
        return res;
    }
}
