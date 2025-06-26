package com.example.demo.services.product;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dtos.product.CreateProductDto;
import com.example.demo.dtos.product.UpdateProductDto;
import com.example.demo.models.Product;
import com.example.demo.models.Category;
import com.example.demo.models.Supplier;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.SupplierRepository;

@Service
public class ProductService implements IProductService {
    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final CategoryRepository categoryRepository;
    @Autowired
    private final SupplierRepository supplierRepository;

    public ProductService(
            SupplierRepository supplierRepository, 
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public Product createProduct(CreateProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setBarCode(dto.getBarCode());
        
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow();
        product.setCategory(category);
        
        Supplier supplier = supplierRepository.findById(dto.getSupplierId()).orElseThrow();
        product.setSupplier(supplier);
        
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(UpdateProductDto dto, Long id) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow();
            product.setCategory(category);
        }
        
        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.getSupplierId()).orElseThrow();
            product.setSupplier(supplier);
        }
        
        if (dto.getBarCode() != null) {
            product.setBarCode(dto.getBarCode());
        }
        
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductsByCategory(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow();
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> getAllProductsBySupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow();
        return productRepository.findBySupplier(supplier);
    }
}
