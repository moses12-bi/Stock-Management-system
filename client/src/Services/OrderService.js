import api from '../axios';

const API_URL = '/orders';

export const GetAllOrders = async (page = 0, size = 10) => {
    try {
        const response = await api.get(`${API_URL}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const GetOrderById = async (id) => {
    try {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const GetOrdersByProduct = async (productId) => {
    try {
        const response = await api.get(`${API_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders by product:', error);
        throw error;
    }
};

export const GetOrdersByStatus = async (status) => {
    try {
        const response = await api.get(`${API_URL}/status/${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        throw error;
    }
};

export const CreateOrder = async (orderData) => {
    try {
        const response = await api.post(API_URL, orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order');
  }
};

const deleteOrder = async (id) => {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete order');
  }
};

const getOrdersByDateRange = async (startDate, endDate, page = 0, size = 10) => {
  try {
    const response = await api.get(`${API_URL}/range`, {
      params: {
        startDate,
        endDate,
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders by date range');
  }
};

const getOrderStats = async () => {
  try {
    const response = await api.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order statistics');
  }
};

const orderService = {
  GetAllOrders,
  GetOrderById,
  GetOrdersByProduct,
  GetOrdersByStatus,
  CreateOrder,
  updateOrder,
  deleteOrder,
  getOrdersByDateRange,
  getOrderStats
};

export default orderService; 