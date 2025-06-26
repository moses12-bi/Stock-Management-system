import axios from "axios";
import { API_URL } from "../config.js";

console.log("API_URL from config:", API_URL);

const CategoryService = {
  testConnection: async () => {
    try {
      const url = `${API_URL}/categories/test`;
      console.log("Testing connection to:", url);
      const response = await axios.get(url);
      console.log("Test response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Connection test failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const url = `${API_URL}/categories`;
      console.log("Making GET request to:", url);
      
      const response = await axios.get(url);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error.response?.data || error.message;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const url = `${API_URL}/categories`;
      console.log("Making POST request to:", url);
      console.log("Request data:", categoryData);
      
      const response = await axios.post(url, categoryData);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      if (error.response?.status === 409) {
        throw new Error("Category with this name already exists");
      }
      throw error.response?.data || error.message;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const url = `${API_URL}/categories/${id}`;
      console.log("Making PUT request to:", url);
      console.log("Request data:", categoryData);
      
      const response = await axios.put(url, categoryData);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      if (error.response?.status === 409) {
        throw new Error("Category with this name already exists");
      }
      throw error.response?.data || error.message;
    }
  },

  deleteCategory: async (id) => {
    try {
      const url = `${API_URL}/categories/${id}`;
      console.log("Making DELETE request to:", url);
      
      const response = await axios.delete(url);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error.response?.data || error.message;
    }
  }
};

export default CategoryService; 