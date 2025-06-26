package com.example.demo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dtos.product.CreateProductDto;
import com.example.demo.dtos.product.UpdateProductDto;
import com.example.demo.models.Product;
import com.example.demo.services.product.IProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final IProductService productService;

        public ProductController(IProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getAllProductsByCategory(id));
    }

    @GetMapping("/supplier/{id}")
    public ResponseEntity<List<Product>> getProductsBySupplier(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getAllProductsBySupplier(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductDto createProductDto) {
        return ResponseEntity.ok(productService.createProduct(createProductDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @RequestBody UpdateProductDto updateProductDto,
            @PathVariable Long id) {
        return ResponseEntity.ok(productService.updateProduct(updateProductDto, id));
    }
}
