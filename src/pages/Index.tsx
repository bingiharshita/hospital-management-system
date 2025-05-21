
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();

  // Determine where to redirect based on auth status and user role
  const getRedirectPath = () => {
    if (!user) {
      return '/login';
    }
    
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/patient-dashboard';
      default:
        return '/login';
    }
  };

  return <Navigate to={getRedirectPath()} replace />;
};

export default Index;
