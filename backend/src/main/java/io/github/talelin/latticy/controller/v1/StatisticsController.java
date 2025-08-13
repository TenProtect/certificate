package io.github.talelin.latticy.controller.v1;

import io.github.talelin.core.annotation.LoginRequired;
import io.github.talelin.latticy.service.StatisticsService;
import io.github.talelin.latticy.vo.stat.MonthlyStatisticsVO;
import io.github.talelin.latticy.vo.stat.OrderStatisticsVO;
import io.github.talelin.latticy.vo.stat.DailyStatisticsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/overview")
    @LoginRequired
    public OrderStatisticsVO getOverview() {
        Map<String, Object> total = statisticsService.getTotalStatistics();
        Map<String, Object> today = statisticsService.getTodayStatistics();
        List<Map<String, Object>> months = statisticsService.getMonthlyStatistics(6);
        OrderStatisticsVO vo = new OrderStatisticsVO();
        if (total != null) {
            vo.setTotalOrders(((Number) total.get("totalOrders")).longValue());
            Object revenue = total.get("totalRevenue");
            if (revenue instanceof BigDecimal) {
                vo.setTotalRevenue((BigDecimal) revenue);
            } else if (revenue != null) {
                vo.setTotalRevenue(new BigDecimal(revenue.toString()));
            } else {
                vo.setTotalRevenue(BigDecimal.ZERO);
            }
        }
        if (today != null) {
            vo.setTodayOrders(((Number) today.getOrDefault("todayOrders", 0)).longValue());
            Object todayRevenue = today.get("todayRevenue");
            if (todayRevenue instanceof BigDecimal) {
                vo.setTodayRevenue((BigDecimal) todayRevenue);
            } else if (todayRevenue != null) {
                vo.setTodayRevenue(new BigDecimal(todayRevenue.toString()));
            } else {
                vo.setTodayRevenue(BigDecimal.ZERO);
            }
        }
        List<MonthlyStatisticsVO> monthList = new ArrayList<>();
        for (Map<String, Object> m : months) {
            MonthlyStatisticsVO mv = new MonthlyStatisticsVO();
            mv.setMonth((String) m.get("month"));
            mv.setOrderCount(((Number) m.get("orderCount")).longValue());
            Object revenue = m.get("orderRevenue");
            if (revenue instanceof BigDecimal) {
                mv.setOrderRevenue((BigDecimal) revenue);
            } else if (revenue != null) {
                mv.setOrderRevenue(new BigDecimal(revenue.toString()));
            } else {
                mv.setOrderRevenue(BigDecimal.ZERO);
            }
            monthList.add(mv);
        }
        vo.setMonthly(monthList);
        return vo;
    }

    @GetMapping("/daily")
    @LoginRequired
    public List<DailyStatisticsVO> getDaily(@RequestParam(value = "days", defaultValue = "14") Integer days) {
        List<Map<String, Object>> daysMap = statisticsService.getDailyStatistics(days);
        List<DailyStatisticsVO> list = new ArrayList<>();
        for (Map<String, Object> m : daysMap) {
            DailyStatisticsVO dv = new DailyStatisticsVO();
            dv.setDate((String) m.get("date"));
            dv.setOrderCount(((Number) m.get("orderCount")).longValue());
            Object revenue = m.get("orderRevenue");
            if (revenue instanceof BigDecimal) {
                dv.setOrderRevenue((BigDecimal) revenue);
            } else if (revenue != null) {
                dv.setOrderRevenue(new BigDecimal(revenue.toString()));
            } else {
                dv.setOrderRevenue(BigDecimal.ZERO);
            }
            list.add(dv);
        }
        return list;
    }
}
