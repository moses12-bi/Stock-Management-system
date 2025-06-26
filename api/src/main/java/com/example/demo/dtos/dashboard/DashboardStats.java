package com.example.demo.dtos.dashboard;

import lombok.Data;

@Data
public class DashboardStats {
    private Long totalSuppliers;
    private Long totalProducts;
    private Long totalCategories;
    private Long totalStockEntries;
    private Long totalStockOutputs;
    private Long stockLowQuantity;
}
