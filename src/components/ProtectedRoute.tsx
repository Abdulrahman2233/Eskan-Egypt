import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '@/api';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  const token = localStorage.getItem('auth_token');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      return;
    }

    // Verify token by calling the /me endpoint
    API.get('/users/auth/me/')
      .then((response) => {
        setIsValid(true);
        const userData = response.data;
        const userIsAdmin = userData.is_staff || userData.is_superuser;
        setIsAdmin(userIsAdmin);
        
        // Update localStorage with server-verified role
        localStorage.setItem('user_role', userIsAdmin ? 'admin' : 'user');
      })
      .catch(() => {
        // Token is invalid - clear localStorage
        setIsValid(false);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  if (!token || !isValid) {
    return <Navigate to="/auth" replace />;
  }

  // إذا كان هناك دور مطلوب، تحقق منه بدقة من السيرفر
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
