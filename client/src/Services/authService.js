import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:8085/api/auth';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const authService = {
  login: async (email, password) => {
    let loadingId;
    try {
      loadingId = toast.loading("Logging in...");
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const userData = response.data;
        
        // Check if 2FA is required
        if (userData.requiresTwoFactor) {
          // Store pending auth data
          localStorage.setItem('pendingAuth', JSON.stringify({
            email: email,
            password: password
          }));
          toast.dismiss(loadingId);
          toast.info("2FA verification required");
          return { requires2FA: true };
        }
        
        // If no 2FA required, proceed with normal login
        // Ensure the token is stored as 'token' for consistency with axios interceptor
        const userToStore = {
          ...userData,
          token: userData.accessToken
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        toast.dismiss(loadingId);
        toast.success("Login successful!");
        return userToStore;
      } else {
        toast.dismiss(loadingId);
        toast.error("Invalid credentials. Please check your email and password.");
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      if (loadingId) {
        toast.dismiss(loadingId);
      }
      if (error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
        throw new Error("Invalid email or password");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
        throw new Error(error.response.data.error);
      } else {
        toast.error("Authentication failed. Please try again.");
        throw new Error("Authentication failed");
      }
    }
  },
  register: async (email, username, password) => {
    let loadingId;
    try {
      loadingId = toast.loading("Registering user...");
      const response = await axios.post(`${API_URL}/register`, {
        name: username,
        email,
        password,
        role: 'USER'
      });
      
      if (response.status === 200) {
        const userData = response.data;
        // Ensure the token is stored as 'token' for consistency with axios interceptor
        const userToStore = {
          ...userData,
          token: userData.accessToken
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        toast.dismiss(loadingId);
        toast.success("Registration successful! You are now logged in.");
        return userToStore;
      } else {
        toast.dismiss(loadingId);
        toast.error("Registration failed. Please try again.");
        throw new Error("Registration failed");
      }
    } catch (error) {
      if (loadingId) {
        toast.dismiss(loadingId);
      }
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
        throw new Error(error.response.data.error);
      } else {
        toast.error("Registration failed. Please try again.");
        throw new Error("Registration failed");
      }
    }
  },
  // Remove setAuthToken since we're handling auth through axios interceptor
  // The token will be handled by the axios interceptor
  logout: () => {
    localStorage.removeItem('user');
    authService.setAuthToken(null);
    toast.success("Logged out successfully!");
  },
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) return JSON.parse(userStr);
      return null;
    } catch (error) {
      toast.error("Failed to retrieve user data");
      return null;
    }
  }
};

export default authService;
