package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Product;
import com.example.demo.models.Category;
import com.example.demo.models.Supplier;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findBySupplier(Supplier supplier);
    long countByQuantityLessThanEqual(int quantity);
    List<Product> findByQuantityLessThanEqual(int quantity);
}
