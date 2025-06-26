package com.example.demo.services.product;

import java.util.List;

import com.example.demo.dtos.product.CreateProductDto;
import com.example.demo.dtos.product.UpdateProductDto;
import com.example.demo.models.Product;

public interface IProductService {
    Product createProduct(CreateProductDto createProductDto);
    Product updateProduct(UpdateProductDto updateProductDto, Long id);
    List<Product> getAllProducts();
    List<Product> getAllProductsByCategory(Long id);
    List<Product> getAllProductsBySupplier(Long id);
}
