package com.example.demo.services.stockoutput;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.stockoutput.UpdateStockOutputDto;
import com.example.demo.dtos.stockoutput.CreateStockOutputDto;
import com.example.demo.models.Product;
import com.example.demo.models.StockOutput;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.StockOutputRepository;

@Service
public class StockOutputService implements IStockOutputService {
    @Autowired
    private final StockOutputRepository stockOutputRepository;

    @Autowired
    private final ProductRepository productRepository;

    public StockOutputService(StockOutputRepository stockOutputRepository, ProductRepository productRepository) {
        this.stockOutputRepository = stockOutputRepository;
        this.productRepository = productRepository;
    }

    @Override
    public StockOutput CreateStockOutput(CreateStockOutputDto createStockOutputDto) {
        // Create new stock output
        StockOutput stockOutput = new StockOutput();
        stockOutput.setDate(createStockOutputDto.getDate());
        stockOutput.setQuantity(createStockOutputDto.getQuantity());
        stockOutput.setDestination(createStockOutputDto.getDestination());
        
        // Get product and check quantity
        Product product = productRepository.findById(createStockOutputDto.getProductId())
            .orElseThrow(() -> new NoSuchElementException("Product not found"));
        
        int newQuantity = product.getQuantity() - createStockOutputDto.getQuantity();

        // Check if the new quantity would be less than 0
        if (newQuantity < 0) {
            throw new RuntimeException("Insufficient stock! Product quantity cannot be less than 0.");
        }
        
        // Set relationships and save
        stockOutput.setProduct(product);
        StockOutput savedStockOutput = stockOutputRepository.save(stockOutput);
        
        // Update product quantity
        product.setQuantity(newQuantity);
        productRepository.save(product);
        
        return savedStockOutput;
    }

    @Override
    public StockOutput GetStockOutputById(Long id) {
        return stockOutputRepository.findById(id).orElseThrow();
    }

    @Override
    public List<StockOutput> GetStockOutputByArticle(Long id) {
        Product product = productRepository.findById(id).orElseThrow();

        return stockOutputRepository.findByProduct(product);
    }

    @Override
    public List<StockOutput> GetAllStockOutput() {
        return stockOutputRepository.findAll();
    }

    @Override
    public StockOutput UpdateStockOutput(UpdateStockOutputDto updateStockOutputDto, Long id) {
        StockOutput stockOutput = stockOutputRepository.findById(id).orElseThrow();
        stockOutput.setDate(updateStockOutputDto.getDate());

        stockOutput.setDestination(updateStockOutputDto.getDestination());
        Product product = stockOutput.getProduct();
        product.setQuantity(product.getQuantity() + stockOutput.getQuantity());

        int newQuantity = product.getQuantity() - updateStockOutputDto.getQuantity();

        // Check if the new quantity would be less than 0
        if (newQuantity < 0) {
            throw new RuntimeException("Insufficient stock! Article quantity cannot be less than 0.");
        }
        stockOutput.setQuantity(updateStockOutputDto.getQuantity());
        product.setQuantity(newQuantity);
        productRepository.save(product);
        return stockOutputRepository.save(stockOutput);

    }

}
