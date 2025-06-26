package com.example.demo.services.stockentry;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.stockentry.CreateStockEntryDto;
import com.example.demo.dtos.stockentry.UpdateStockEntryDto;
import com.example.demo.models.Product;
import com.example.demo.models.StockEntry;
import com.example.demo.models.Supplier;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.StockEntryRepository;
import com.example.demo.repositories.SupplierRepository;

@Service
public class StockEntryService implements IStockEntryService {
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final SupplierRepository supplierRepository;
    @Autowired
    private final StockEntryRepository stockEntryRepository;

    @Override
    public List<StockEntry> getStockEntryBySupplier(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
            .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return stockEntryRepository.findBySupplier(supplier);
    }

    @Override
    public StockEntry createStockEntry(CreateStockEntryDto createStockEntryDto) {
        // Find the product and supplier
        Product product = productRepository.findById(createStockEntryDto.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Supplier supplier = supplierRepository.findById(createStockEntryDto.getSupplierId())
            .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Create new stock entry
        StockEntry stockEntry = new StockEntry();
        stockEntry.setProduct(product);
        stockEntry.setSupplier(supplier);
        stockEntry.setQuantity(createStockEntryDto.getQuantity());
        stockEntry.setDate(createStockEntryDto.getDate());
        
        // Save and return
        return stockEntryRepository.save(stockEntry);
    }

    public StockEntryService(ProductRepository productRepository, StockEntryRepository stockEntryRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.stockEntryRepository = stockEntryRepository;
        this.supplierRepository = supplierRepository;

    }

    

    @Override
    public StockEntry updateStockEntry(UpdateStockEntryDto updateStockEntryDto, Long id) {
        StockEntry stockEntry = stockEntryRepository.findById(id).orElseThrow();
        Product product = stockEntry.getProduct();

        // Revert the previous stock quantity change
        product.setQuantity(product.getQuantity() - stockEntry.getQuantity());

        // Update StockEntry with new values from DTO
        stockEntry.setQuantity(updateStockEntryDto.getQuantity());
        stockEntry.setDate(updateStockEntryDto.getDate());

        // Apply the new quantity change
        product.setQuantity(product.getQuantity() + updateStockEntryDto.getQuantity());

        // Save the updated product
        productRepository.save(product);

        // Save the updated stock entry
        return stockEntryRepository.save(stockEntry);
    }

    @Override
    public StockEntry getStockEntryById(Long id) {
        return stockEntryRepository.findById(id).orElseThrow();
    }

    @Override
    public List<StockEntry> getStockEntryByProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow();
        return stockEntryRepository.findByProduct(product);

    }



    @Override
    public List<StockEntry> getAllStockEntries() {
        return stockEntryRepository.findAll();

    }

}
