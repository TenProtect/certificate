package io.github.talelin.latticy.common.enumeration;

/**
 * Common asynchronous notification types supported by the system.
 * Currently placeholders without concrete processing.
 */
public enum AsyncNotifyType {
    /** Alipay payment notifications */
    ALIPAY,
    /** WeChat Pay payment notifications */
    WECHAT_PAY,
    /** UnionPay payment notifications */
    UNION_PAY,
    /** SMS delivery reports */
    SMS,
    /** Email delivery events */
    EMAIL,
    /** Logistics status updates */
    LOGISTICS
}
