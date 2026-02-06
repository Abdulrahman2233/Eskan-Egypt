import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

export default ProtectedRoute;
