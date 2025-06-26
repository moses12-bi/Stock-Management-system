package com.example.demo.services.dashboard;

import com.example.demo.dtos.dashboard.DashboardStats;
import com.example.demo.dtos.dashboard.StockEntryProgressDto;
import com.example.demo.dtos.dashboard.StockOutputProgressDto;
import java.util.*;

public interface IDashboardService {
    DashboardStats getDashboardStats();

    List<StockEntryProgressDto> getStockEntryProgress();

    List<StockOutputProgressDto> getStockOutputProgress();
}
