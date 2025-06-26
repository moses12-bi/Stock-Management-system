import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    
    // Check if we have a valid user and token
    const isValidAuth = isAuthenticated && user && user.token;
    
    if (!isValidAuth) {
        // Clear any stale auth data
        localStorage.removeItem('user');
        localStorage.removeItem('pendingAuth');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;