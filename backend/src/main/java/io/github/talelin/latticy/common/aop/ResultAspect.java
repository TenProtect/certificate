package io.github.talelin.latticy.common.aop;

import cn.hutool.core.util.StrUtil;
import io.github.talelin.latticy.common.configuration.CodeMessageConfiguration;
import io.github.talelin.latticy.vo.UnifyResponseVO;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * 处理返回结果为 UnifyResponseVO 的视图函数
 * 默认的返回均是英文，在此处通过code替换成中文
 *
 * @author pedro@TaleLin
 * @author colorful@TaleLin
 */
@Aspect
@Component
@Slf4j
public class ResultAspect {


    @Pointcut("execution(public * io.github.talelin.latticy.controller..*.*(..))")
    public void handlePlaceholder() {
    }

    @AfterReturning(returning = "ret", pointcut = "handlePlaceholder()")
    public void doAfterReturning(Object ret) throws Throwable {
        if (ret instanceof UnifyResponseVO) {
            UnifyResponseVO result = (UnifyResponseVO) ret;
            int code = result.getCode();
            String message = CodeMessageConfiguration.getMessage(code);
            // 检查是否需要设置消息，避免类型转换异常
            if (StrUtil.isNotBlank(message)) {
                Object currentMessage = result.getMessage();
                // 只有当前消息为null、空字符串或者是字符串类型且为空时才设置新消息
                if (currentMessage == null ||
                    (currentMessage instanceof String && StrUtil.isBlank((String) currentMessage))) {
                    result.setMessage(message);
                }
            }
        }
    }
}
