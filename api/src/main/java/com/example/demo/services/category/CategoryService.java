package com.example.demo.services.category;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.example.demo.dtos.category.CreateCategoryDto;
import com.example.demo.models.Category;
import com.example.demo.repositories.CategoryRepository;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoryService implements ICategoryService {
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        try {
            logger.info("Attempting to fetch all categories");
            List<Category> categories = categoryRepository.findAll();
            logger.info("=== Database Content ===");
            logger.info("Total categories in database: {}", categories.size());
            categories.forEach(category -> 
                logger.info("Category in DB: id={}, name='{}', description='{}', createdAt={}, updatedAt={}", 
                    category.getId(), 
                    category.getName(), 
                    category.getDescription(),
                    category.getCreatedAt(),
                    category.getUpdatedAt()
                )
            );
            logger.info("=== End Database Content ===");
            return categories;
        } catch (Exception e) {
            logger.error("Error fetching all categories", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching categories: " + e.getMessage());
        }
    }

    @Override
    public Category getCategoryById(Long id) {
        try {
            logger.info("Attempting to fetch category with id: {}", id);
            return categoryRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.warn("Category not found with id: {}", id);
                        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
                    });
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error fetching category with id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching category: " + e.getMessage());
        }
    }

    @Override
    public Category createCategory(CreateCategoryDto createCategoryDto) {
        try {
            logger.info("Attempting to create category with name: {}", createCategoryDto.getName());
            
            // Trim the name to avoid whitespace issues
            String trimmedName = createCategoryDto.getName().trim();
            
            // Check if a category with this name exists (case-insensitive)
            if (categoryRepository.existsByName(trimmedName)) {
                logger.warn("Category with name '{}' already exists", trimmedName);
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT, 
                    "A category with this name already exists. Please choose a different name."
                );
            }

            Category category = new Category();
            category.setName(trimmedName);
            category.setDescription(createCategoryDto.getDescription() != null ? 
                createCategoryDto.getDescription().trim() : null);
            
            Category savedCategory = categoryRepository.save(category);
            logger.info("Successfully created category with id: {}", savedCategory.getId());
            return savedCategory;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error creating category", e);
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR, 
                "Error creating category: " + e.getMessage()
            );
        }
    }

    @Override
    public Category updateCategory(Long id, CreateCategoryDto updateCategoryDto) {
        try {
            logger.info("Attempting to update category with id: {}", id);
            Category category = getCategoryById(id);

            if (!category.getName().equals(updateCategoryDto.getName()) && 
                categoryRepository.existsByName(updateCategoryDto.getName())) {
                logger.warn("Category with name '{}' already exists", updateCategoryDto.getName());
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Category with this name already exists");
            }

            category.setName(updateCategoryDto.getName());
            category.setDescription(updateCategoryDto.getDescription());
            
            Category updatedCategory = categoryRepository.save(category);
            logger.info("Successfully updated category with id: {}", id);
            return updatedCategory;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error updating category with id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating category: " + e.getMessage());
        }
    }

    @Override
    public void deleteCategory(Long id) {
        try {
            logger.info("Attempting to delete category with id: {}", id);
            if (!categoryRepository.existsById(id)) {
                logger.warn("Category not found with id: {}", id);
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
            }
            categoryRepository.deleteById(id);
            logger.info("Successfully deleted category with id: {}", id);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error deleting category with id: {}", id, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting category: " + e.getMessage());
        }
    }

    public void cleanupDuplicateCategories() {
        try {
            logger.info("Starting cleanup of duplicate categories");
            List<Category> allCategories = categoryRepository.findAll();
            Map<String, List<Category>> categoriesByName = allCategories.stream()
                .collect(Collectors.groupingBy(Category::getName));

            categoriesByName.forEach((name, duplicates) -> {
                if (duplicates.size() > 1) {
                    logger.info("Found {} duplicates for category '{}'", duplicates.size(), name);
                    // Keep the first one, delete the rest
                    duplicates.stream()
                        .skip(1)
                        .forEach(category -> {
                            logger.info("Deleting duplicate category: id={}, name='{}'", category.getId(), category.getName());
                            categoryRepository.delete(category);
                        });
                }
            });
            logger.info("Cleanup completed");
        } catch (Exception e) {
            logger.error("Error during category cleanup", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error cleaning up categories: " + e.getMessage());
        }
    }
}
