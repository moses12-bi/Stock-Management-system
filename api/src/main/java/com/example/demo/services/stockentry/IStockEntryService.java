package com.example.demo.services.stockentry;

import java.util.List;

import com.example.demo.models.StockEntry;
import com.example.demo.dtos.stockentry.UpdateStockEntryDto;
import com.example.demo.dtos.stockentry.CreateStockEntryDto;

public interface IStockEntryService {
    StockEntry createStockEntry(CreateStockEntryDto createStockEntryDto);
    StockEntry updateStockEntry(UpdateStockEntryDto updateStockEntryDto, Long id);
    StockEntry getStockEntryById(Long id);
    List<StockEntry> getStockEntryByProduct(Long id);
    List<StockEntry> getStockEntryBySupplier(Long id);
    List<StockEntry> getAllStockEntries();
}
