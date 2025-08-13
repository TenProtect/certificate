package io.github.talelin.latticy.vo.stat;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MonthlyStatisticsVO {
    private String month;
    private Long orderCount;
    private BigDecimal orderRevenue;
}
