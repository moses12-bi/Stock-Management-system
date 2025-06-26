package com.example.demo.controllers;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import jakarta.validation.Valid;

import com.example.demo.dtos.category.CreateCategoryDto;
import com.example.demo.models.Category;
import com.example.demo.services.category.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class CategoryController {
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("Category API is working!");
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        try {
            logger.info("Fetching all categories");
            List<Category> categories = categoryService.getAllCategories();
            logger.info("Found {} categories", categories.size());
            categories.forEach(category -> 
                logger.info("Category: id={}, name={}, description={}, createdAt={}, updatedAt={}", 
                    category.getId(), 
                    category.getName(), 
                    category.getDescription(),
                    category.getCreatedAt(),
                    category.getUpdatedAt()
                )
            );
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error fetching categories", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        try {
            logger.info("Fetching category with id: {}", id);
            Category category = categoryService.getCategoryById(id);
            logger.info("Found category: id={}, name={}, description={}, createdAt={}, updatedAt={}", 
                category.getId(), 
                category.getName(), 
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
            );
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            logger.error("Error fetching category with id: {}", id, e);
            throw e;
        }
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CreateCategoryDto createCategoryDto) {
        try {
            logger.info("Creating new category: {}", createCategoryDto.getName());
            Category category = categoryService.createCategory(createCategoryDto);
            logger.info("Created category: id={}, name={}, description={}, createdAt={}, updatedAt={}", 
                category.getId(), 
                category.getName(), 
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
            );
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            logger.error("Error creating category: {}", createCategoryDto.getName(), e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryDto updateCategoryDto) {
        try {
            logger.info("Updating category with id: {}", id);
            Category category = categoryService.updateCategory(id, updateCategoryDto);
            logger.info("Updated category: id={}, name={}, description={}, createdAt={}, updatedAt={}", 
                category.getId(), 
                category.getName(), 
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
            );
            return ResponseEntity.ok(category);
        } catch (Exception e) {
            logger.error("Error updating category with id: {}", id, e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            logger.info("Deleting category with id: {}", id);
            categoryService.deleteCategory(id);
            logger.info("Successfully deleted category with id: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting category with id: {}", id, e);
            throw e;
        }
    }

    @PostMapping("/cleanup")
    public ResponseEntity<String> cleanupCategories() {
        try {
            logger.info("Starting category cleanup");
            categoryService.cleanupDuplicateCategories();
            return ResponseEntity.ok("Category cleanup completed successfully");
        } catch (Exception e) {
            logger.error("Error during category cleanup", e);
            throw e;
        }
    }
}
