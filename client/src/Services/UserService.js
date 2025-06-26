import axios from 'axios';

const API_URL = '/api/users';

const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
};

const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

const changePassword = async (currentPassword, newPassword) => {
  try {
    await axios.post(`${API_URL}/change-password`, {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

const requestPasswordReset = async (email) => {
  try {
    await axios.post(`${API_URL}/reset-password-request`, { email });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request password reset');
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    await axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword,
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

const enable2FA = async () => {
  try {
    const response = await axios.post(`${API_URL}/2fa/enable`);
    return response.data; // Returns QR code and secret
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to enable 2FA');
  }
};

const verify2FA = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/2fa/verify`, { token });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify 2FA token');
  }
};

const disable2FA = async (token) => {
  try {
    await axios.post(`${API_URL}/2fa/disable`, { token });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to disable 2FA');
  }
};

const getUsersByRole = async (role) => {
  try {
    const response = await axios.get(`${API_URL}/by-role/${role}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users by role');
  }
};

const updateUserRole = async (userId, role) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user role');
  }
};

const userService = {
  getCurrentUser,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  enable2FA,
  verify2FA,
  disable2FA,
  getUsersByRole,
  updateUserRole,
};

export default userService; 