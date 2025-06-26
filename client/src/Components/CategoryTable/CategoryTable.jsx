import React, { useState } from "react";
import CategoryService from "../../Services/CategoryService";
import { useToast } from "../../contexts/ToastContext";
import AddCategoryModal from "../AddCategoryModal/AddCategoryModal";
import EditCategoryModal from "../EditCategoryModal/EditCategoryModal";

const CategoryTable = ({ categories, onCategoriesChange }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { showToast } = useToast();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await CategoryService.deleteCategory(id);
        showToast("Category deleted successfully", "success");
        onCategoriesChange(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting category:", error);
        showToast(error.message || "Failed to delete category", "error");
      }
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedCategory) => {
    try {
      await CategoryService.updateCategory(updatedCategory.id, updatedCategory);
      showToast("Category updated successfully", "success");
      onCategoriesChange(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating category:", error);
      showToast(error.message || "Failed to update category", "error");
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await CategoryService.createCategory(newCategory);
      showToast("Category created successfully", "success");
      onCategoriesChange(); // Refresh the list after adding
      return response;
    } catch (error) {
      console.error("Error creating category:", error);
      showToast(error.message || "Failed to create category", "error");
      throw error;
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Categories
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add Category
        </button>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3">Created At</th>
            <th scope="col" className="px-6 py-3">Updated At</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {category.id}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {category.name}
              </td>
              <td className="px-6 py-4">{category.description}</td>
              <td className="px-6 py-4">
                {category.createdAt ? new Date(category.createdAt).toLocaleString() : 'N/A'}
              </td>
              <td className="px-6 py-4">
                {category.updatedAt ? new Date(category.updatedAt).toLocaleString() : 'N/A'}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(category)}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="font-medium text-red-600 dark:text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddCategoryModal
          onClose={async (newCategory) => {
            setShowAddModal(false);
            if (newCategory) {
              await handleAddCategory(newCategory);
            }
          }}
        />
      )}

      {showEditModal && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default CategoryTable;
