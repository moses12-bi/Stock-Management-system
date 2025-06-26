package com.example.demo.services.stockoutput;

import java.util.List;

import com.example.demo.dtos.stockoutput.CreateStockOutputDto;
import com.example.demo.dtos.stockoutput.UpdateStockOutputDto;
import com.example.demo.models.StockOutput;

public interface IStockOutputService {
    StockOutput CreateStockOutput(CreateStockOutputDto createStockOutputDto);

    StockOutput GetStockOutputById(Long id);

    List<StockOutput> GetStockOutputByArticle(Long id);

    List<StockOutput> GetAllStockOutput();

    StockOutput UpdateStockOutput(UpdateStockOutputDto updateStockOutputDto, Long id);

}
