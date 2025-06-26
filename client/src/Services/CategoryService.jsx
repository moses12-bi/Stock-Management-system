import api from "../axios";

const API_URL = '/category';

export default {
  getAllCategories: async () => {
    try {
      const response = await api.get(`${API_URL}/all`);
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }));
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },
  createCategory: async (categoryData) => {
    try {
      const response = await api.post(`${API_URL}`, categoryData);
      if (response.data) {
        return {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt
        };
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },
  deleteCategory: async (id) => {
    try {
      await api.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }
};
