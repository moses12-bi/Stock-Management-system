import api from '../axios';
import authService from './authService';

const API_URL = '/dashboard';

export const GetDashboardStats = async () => {
    try {
        console.log('Making API request to:', `${API_URL}/get-dashboard-stats`);
        const response = await api.get(`${API_URL}/get-dashboard-stats`);
        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        console.error('Error details:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
};

export const GetStockEntryProgress = async () => {
    try {
        const response = await api.get(`${API_URL}/get-entries-progress`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock entry progress:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch stock entry progress');
    }
};

export const GetStockOutputProgress = async () => {
    try {
        const response = await api.get(`${API_URL}/get-outputs-progress`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock output progress:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch stock output progress');
    }
};
