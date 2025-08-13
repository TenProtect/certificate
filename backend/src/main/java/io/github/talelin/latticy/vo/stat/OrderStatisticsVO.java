package io.github.talelin.latticy.vo.stat;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderStatisticsVO {
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long todayOrders;
    private BigDecimal todayRevenue;
    private List<MonthlyStatisticsVO> monthly;
}
