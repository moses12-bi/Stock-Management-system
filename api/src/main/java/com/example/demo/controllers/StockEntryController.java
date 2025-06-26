package com.example.demo.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.stockentry.CreateStockEntryDto;
import com.example.demo.dtos.stockentry.UpdateStockEntryDto;
import com.example.demo.models.StockEntry;
import com.example.demo.services.stockentry.IStockEntryService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/Api/StockEntry/")
public class StockEntryController {
    private final IStockEntryService stockEntryService;

    public StockEntryController(IStockEntryService stockEntryService) {
        this.stockEntryService = stockEntryService;
    }

    @PostMapping("CreateStockEntry")
    public ResponseEntity<StockEntry> CreateStockEntry(@RequestBody CreateStockEntryDto createStockEntryDto) {
        return ResponseEntity.ok(stockEntryService.createStockEntry(createStockEntryDto));
    }

    @PutMapping("UpdateStockEntry/{id}")
    public ResponseEntity<StockEntry> UpdateStockEntry(@PathVariable("id") Long id, @RequestBody UpdateStockEntryDto updateStockEntryDto) {

        return ResponseEntity.ok(stockEntryService.updateStockEntry(updateStockEntryDto, id));
    }

    @GetMapping("GetStockEntryById/{id}")
    public ResponseEntity<StockEntry> GetStockEntryById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(stockEntryService.getStockEntryById(id));
    }

    @GetMapping("GetStockEntryBySupplier/{id}")
    public ResponseEntity<List<StockEntry>> GetStockEntryBySupplier(@PathVariable("id") Long id) {
        return ResponseEntity.ok(stockEntryService.getStockEntryBySupplier(id));
    }

    @GetMapping("GetStockEntryByProduct/{id}")
    public ResponseEntity<List<StockEntry>> GetStockEntryByProduct(@PathVariable("id") Long id) {
        return ResponseEntity.ok(stockEntryService.getStockEntryByProduct(id));
    }

    @GetMapping("GetAllStockEntries")
    public ResponseEntity<List<StockEntry>> GetAllStockEntries() {
        return ResponseEntity.ok(stockEntryService.getAllStockEntries());
    }
}
