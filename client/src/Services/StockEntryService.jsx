import axios from "axios";

const API_URL = '/api/stock-entry';

export const StockEntryService = {
  GetAllStockEntries: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stock entries');
    }
  },
  GetStockEntryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stock entry');
    }
  },
  CreateStockEntry: async (stockEntryData) => {
    try {
      const response = await axios.post(API_URL, stockEntryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create stock entry');
    }
  },
  UpdateStockEntry: async (id, stockEntryData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, stockEntryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update stock entry');
    }
  },
  DeleteStockEntry: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete stock entry');
    }
  }
};
