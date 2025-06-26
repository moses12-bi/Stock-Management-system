package com.example.demo.services.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.dashboard.DashboardStats;
import com.example.demo.dtos.dashboard.StockEntryProgressDto;
import com.example.demo.dtos.dashboard.StockOutputProgressDto;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.StockEntryRepository;
import com.example.demo.repositories.StockOutputRepository;
import com.example.demo.repositories.SupplierRepository;
import java.util.*;


@Service
public class DashboardService implements IDashboardService {
    @Autowired
    private final SupplierRepository supplierRepository;
    @Autowired
    private final StockEntryRepository stockEntryRepository;
    @Autowired
    private final StockOutputRepository stockOutputRepository;
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final CategoryRepository categoryRepository;

    public DashboardService(StockOutputRepository stockOutputRepository, ProductRepository productRepository,
            StockEntryRepository stockEntryRepository, CategoryRepository categoryRepository,
            SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.stockEntryRepository = stockEntryRepository;
        this.stockOutputRepository = stockOutputRepository;
    }

    @Override
    public DashboardStats getDashboardStats() {
        DashboardStats dashboardStats = new DashboardStats();
        dashboardStats.setTotalSuppliers(supplierRepository.count());
        dashboardStats.setTotalProducts(productRepository.count());
        dashboardStats.setTotalCategories(categoryRepository.count());
        dashboardStats.setTotalStockEntries(stockEntryRepository.count());
        dashboardStats.setTotalStockOutputs(stockOutputRepository.count());
        dashboardStats.setStockLowQuantity(productRepository.countByQuantityLessThanEqual(10));
        return dashboardStats;
    }

    @Override
    public List<StockEntryProgressDto> getStockEntryProgress() {
        List<Object[]> result = stockEntryRepository.getStockEntryProgress();
        List<StockEntryProgressDto> progressDTOs = new ArrayList<>();

        for (Object[] row : result) {
            String month = (String) row[0];
            int totalQuantity = ((Number) row[1]).intValue();
            progressDTOs.add(new StockEntryProgressDto(month, totalQuantity));
        }

        return progressDTOs;
    }

    @Override
    public List<StockOutputProgressDto> getStockOutputProgress() {
        List<Object[]> result = stockOutputRepository.getStockOutputProgress();
        List<StockOutputProgressDto> progressDTOs = new ArrayList<>();

        for (Object[] row : result) {
            String date = (String) row[0];
            Long quantity = ((Number) row[1]).longValue();
            Double totalValue = ((Number) row[2]).doubleValue();
            
            StockOutputProgressDto dto = new StockOutputProgressDto();
            dto.setDate(date);
            dto.setQuantity(quantity);
            dto.setTotalValue(totalValue);
            progressDTOs.add(dto);
        }

        return progressDTOs;
    }
}
