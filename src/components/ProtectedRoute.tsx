import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');
  const user = localStorage.getItem('user');

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // إذا كان هناك دور مطلوب، تحقق منه بدقة
  if (requiredRole === 'admin') {
    // يجب أن يكون المستخدم admin بالفعل
    if (userRole !== 'admin') {
      // إذا لم يكن admin، اعيده للصفحة الرئيسية
      return <Navigate to="/" replace />;
    }
  }

  return element;
};

export default ProtectedRoute;
