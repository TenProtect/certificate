package io.github.talelin.latticy.vo.stat;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DailyStatisticsVO {
    private String date;
    private Long orderCount;
    private BigDecimal orderRevenue;
}
