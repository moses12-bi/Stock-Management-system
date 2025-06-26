import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8085/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    try {
      console.log('=== Axios Request Interceptor ===');
      // Get user data from localStorage
      const user = localStorage.getItem('user');
      console.log('User in localStorage:', user);
      
      if (user) {
        const userData = JSON.parse(user);
        console.log('Parsed user data:', userData);
        
        if (userData.token) {
          console.log('Adding Authorization header with token');
          // Add Bearer token to Authorization header
          config.headers.Authorization = `Bearer ${userData.token}`;
        } else {
          console.log('No token found in user data');
        }
      } else {
        console.log('No user found in localStorage');
      }
      
      console.log('Request config:', config);
      console.log('=== End Axios Request Interceptor ===');
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response);
      
      if (error.response.status === 403) {
        // Handle 403 Forbidden errors
        console.error('403 Forbidden error. Token might be expired or invalid.');
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          console.error('Current token:', userData.token ? userData.token.substring(0, 10) + '...' : 'No token');
        }
        toast.error('Access denied. Please try logging in again.');
        // Redirect to login if token is invalid
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Unauthorized'));
      } else if (error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Error: ${error.response.status} - ${error.response.statusText}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      toast.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
