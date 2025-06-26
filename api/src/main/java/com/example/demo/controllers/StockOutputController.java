package com.example.demo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.example.demo.dtos.stockoutput.CreateStockOutputDto;
import com.example.demo.dtos.stockoutput.UpdateStockOutputDto;
import com.example.demo.models.StockOutput;
import com.example.demo.services.stockoutput.IStockOutputService;

@RestController
@RequestMapping("/Api/SortieStock/")
public class StockOutputController {
    private final IStockOutputService stockOutputService;

    public StockOutputController(IStockOutputService stockOutputService) {
        this.stockOutputService = stockOutputService;
    }

    @PostMapping("CreateSortieStock")
    public ResponseEntity<StockOutput> CreateSortieStock(@RequestBody CreateStockOutputDto createStockOutputDto) {
        return ResponseEntity.ok(stockOutputService.CreateStockOutput(createStockOutputDto));
    }

    @PutMapping("UpdateSortieStock/{id}")
    public ResponseEntity<StockOutput> UpdateSortieStock(@PathVariable("id") Long id,
            @RequestBody UpdateStockOutputDto stockOutputDto) {

        return ResponseEntity.ok(stockOutputService.UpdateStockOutput(stockOutputDto, id));
    }

    @GetMapping("GetStockOutputById/{id}")
    public ResponseEntity<StockOutput> GetStockOutputById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(stockOutputService.GetStockOutputById(id));
    }

    @GetMapping("GetStockOutputByProduct/{id}")
    public ResponseEntity<List<StockOutput>> GetStockOutputByProduct(@PathVariable("id") Long id) {
        return ResponseEntity.ok(stockOutputService.GetStockOutputByArticle(id));
    }

    @GetMapping("GetAllStockOutputs")
    public ResponseEntity<List<StockOutput>> GetAllStockOutputs() {
        return ResponseEntity.ok(stockOutputService.GetAllStockOutput());
    }
}
