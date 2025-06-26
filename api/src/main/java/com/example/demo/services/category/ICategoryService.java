package com.example.demo.services.category;

import java.util.List;
import com.example.demo.dtos.category.CreateCategoryDto;
import com.example.demo.models.Category;

public interface ICategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category createCategory(CreateCategoryDto createCategoryDto);
    Category updateCategory(Long id, CreateCategoryDto updateCategoryDto);
    void deleteCategory(Long id);
}
