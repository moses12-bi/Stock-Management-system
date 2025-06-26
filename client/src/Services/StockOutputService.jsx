import axios from "axios";

const API_URL = '/api/stock-output';

export const StockOutputService = {
  GetAllStockOutputs: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stock outputs');
    }
  },
  GetStockOutputById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stock output');
    }
  },
  CreateStockOutput: async (stockOutputData) => {
    try {
      const response = await axios.post(API_URL, stockOutputData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create stock output');
    }
  },
  UpdateStockOutput: async (id, stockOutputData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, stockOutputData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update stock output');
    }
  },
  DeleteStockOutput: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete stock output');
    }
  }
};
