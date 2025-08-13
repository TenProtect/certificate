package io.github.talelin.latticy.service;

import io.github.talelin.latticy.mapper.OrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StatisticsService {

    @Autowired
    private OrderMapper orderMapper;

    public Map<String, Object> getTotalStatistics() {
        return orderMapper.getTotalStatistics();
    }

    public List<Map<String, Object>> getMonthlyStatistics(Integer monthLimit) {
        return orderMapper.getMonthlyStatistics(monthLimit);
    }

    public List<Map<String, Object>> getDailyStatistics(Integer dayLimit) {
        return orderMapper.getDailyStatistics(dayLimit);
    }

    public Map<String, Object> getTodayStatistics() {
        return orderMapper.getTodayStatistics();
    }
}
