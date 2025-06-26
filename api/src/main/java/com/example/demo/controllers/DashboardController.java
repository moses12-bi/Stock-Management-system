package com.example.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.example.demo.dtos.dashboard.StockEntryProgressDto;
import com.example.demo.dtos.dashboard.StockOutputProgressDto;
import com.example.demo.dtos.dashboard.DashboardStats;
import com.example.demo.services.dashboard.IDashboardService;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/dashboard/")
@PreAuthorize("hasRole('USER')")
public class DashboardController {
    
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    private final IDashboardService dashboardService;

    public DashboardController(IDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("get-dashboard-stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        try {
            logger.info("Fetching dashboard stats");
            DashboardStats stats = dashboardService.getDashboardStats();
            logger.info("Dashboard stats retrieved: {}", stats);
            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            logger.error("Error fetching dashboard stats", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new DashboardStats());
        }
    }

    @GetMapping("get-entries-progress")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<StockEntryProgressDto>> getEntriesProgress() {
        try {
            List<StockEntryProgressDto> progress = dashboardService.getStockEntryProgress();
            return ResponseEntity.ok(progress);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of());
        }
    }

    @GetMapping("get-outputs-progress")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<StockOutputProgressDto>> getOutputsProgress() {
        try {
            List<StockOutputProgressDto> progress = dashboardService.getStockOutputProgress();
            return ResponseEntity.ok(progress);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(List.of());
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("An error occurred while fetching dashboard data");
    }
}
