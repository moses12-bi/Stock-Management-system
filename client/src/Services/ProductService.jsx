import api from "../axios";
import { toast } from 'react-hot-toast';
import authService from './authService';

const API_URL = 'http://localhost:8085/api/products';

const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  createProduct: async (productData) => {
    try {
      const loadingId = toast.loading("Creating product...");
      const response = await api.post(API_URL, productData);
      toast.dismiss(loadingId);
      return response.data;
    } catch (error) {
      toast.dismiss(loadingId);
      console.error("Error creating product:", error);
      throw error;
    }
  },
  updateProduct: async (productData) => {
    try {
      const loadingId = toast.loading("Updating product...");
      const response = await api.put(`${API_URL}/${productData.id}`, productData);
      toast.dismiss(loadingId);
      return response.data;
    } catch (error) {
      toast.dismiss(loadingId);
      console.error("Error updating product:", error);
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      const loadingId = toast.loading("Deleting product...");
      const response = await api.delete(`${API_URL}/${id}`);
      toast.dismiss(loadingId);
      return response.data;
    } catch (error) {
      toast.dismiss(loadingId);
      console.error("Error deleting product:", error);
      throw error;
    }
  }
};

export default productService;
