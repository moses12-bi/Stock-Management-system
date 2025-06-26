import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing user data on mount
        const storedUser = localStorage.getItem('user');
        
        try {
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (userData && userData.token) { // Added null check for userData
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    // Clear invalid auth data
                    console.warn('Invalid user data found in localStorage, clearing.');
                    localStorage.removeItem('user');
                }
            }
        } catch (error) {
            console.error('Failed to parse user from localStorage:', error);
            localStorage.removeItem('user'); // Clear corrupted data
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            // Handle 2FA response
            if (response.data.requiresTwoFactor) {
                // Store pending authentication for 2FA
                localStorage.setItem('pendingAuth', JSON.stringify({
                    email: response.data.email
                }));
                
                // Show debug code in development
                if (response.data.debug_code) {
                    console.log('Development mode - 2FA code:', response.data.debug_code);
                }
                
                return {
                    success: true,
                    requiresTwoFactor: true,
                    email: response.data.email
                };
            }

            // Regular login success
            const userData = {
                email: response.data.email,
                token: response.data.accessToken
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData);
            setIsAuthenticated(true);
            
            return {
                success: true,
                requiresTwoFactor: false
            };
        } catch (error) {
            console.error('Login error:', error);
            
            // Check if the error is a 2FA requirement
            if (error.response?.data?.requiresTwoFactor || 
                error.response?.data?.message === '2FA required' ||
                error.message === '2FA required') {
                
                // Store pending authentication for 2FA
                const email = error.response?.data?.email || email;
                localStorage.setItem('pendingAuth', JSON.stringify({ email }));
                
                // Show debug code in development
                if (error.response?.data?.debug_code) {
                    console.log('Development mode - 2FA code:', error.response.data.debug_code);
                }
                
                return {
                    success: true,
                    requiresTwoFactor: true,
                    email: email
                };
            }
            
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    };

    const verify2FA = async (code) => {
        try {
            const pendingAuth = JSON.parse(localStorage.getItem('pendingAuth'));
            if (!pendingAuth || !pendingAuth.email) {
                console.error('No pending authentication found in localStorage');
                return {
                    success: false,
                    error: 'No pending authentication found'
                };
            }

            console.log('Sending 2FA verification request:', {
                email: pendingAuth.email,
                code: code
            });

            const response = await api.post('/auth/verify-2fa', {
                email: pendingAuth.email,
                code: code
            });

            console.log('2FA verification response:', response.data);

            if (!response.data.token) {
                console.error('No token in response:', response.data);
                return {
                    success: false,
                    error: 'Invalid response from server'
                };
            }

            const userData = {
                email: response.data.email,
                token: response.data.token
            };

            // Store auth data
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.removeItem('pendingAuth');

            // Update state and wait for it to complete
            await Promise.all([
                new Promise(resolve => {
                    setUser(userData);
                    resolve();
                }),
                new Promise(resolve => {
                    setIsAuthenticated(true);
                    resolve();
                })
            ]);
            setLoading(false); // Ensure loading is set to false

            return {
                success: true,
                user: userData
            };
        } catch (error) {
            console.error('2FA verification error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Verification failed'
            };
        }
    };

    const resend2FA = async () => {
        try {
            const pendingAuth = JSON.parse(localStorage.getItem('pendingAuth'));
            if (!pendingAuth || !pendingAuth.email) {
                return {
                    success: false,
                    error: 'No pending authentication found'
                };
            }

            const response = await api.post('/auth/resend-2fa', {
                email: pendingAuth.email
            });

            // Show debug code in development
            if (response.data.debug_code) {
                console.log('Development mode - New 2FA code:', response.data.debug_code);
            }

            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Resend 2FA error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to resend verification code'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:8085/api/auth/register', userData);
            const { token, email } = response.data;
            
            const newUserData = { token, email };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUserData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(newUserData);
            setIsAuthenticated(true);
            
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        try {
            // Clear all auth-related data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('pendingAuth');
            
            // Clear axios default headers
            delete axios.defaults.headers.common['Authorization'];
            
            // Reset state
            setUser(null);
            setIsAuthenticated(false);
            
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        verify2FA,
        resend2FA,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 