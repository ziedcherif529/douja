import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser?.role !== role) {
    // Redirect to appropriate dashboard if trying to access wrong role area
    if (currentUser?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/client/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;