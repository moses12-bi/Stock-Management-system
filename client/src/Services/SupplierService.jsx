import api from "../axios";

const API_URL = '/supplier';

const supplierService = {
  getAllSuppliers: async () => {
    try {
      const response = await api.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  },
  getSupplierById: async (id) => {
    try {
      const response = await api.get(`${API_URL}${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching supplier:", error);
      throw error;
    }
  },
  createSupplier: async (supplierData) => {
    try {
      const response = await api.post(`${API_URL}`, supplierData);
      return response.data;
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  },
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`${API_URL}${id}`, supplierData);
      return response.data;
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },
  deleteSupplier: async (id) => {
    try {
      await api.delete(`${API_URL}${id}`);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  }
};

export default supplierService;
