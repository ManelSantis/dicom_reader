import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" />;
};
