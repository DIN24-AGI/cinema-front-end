import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface ProtectedResourceProps {
  token: string | null;
  children: React.ReactNode;
}

const ProtectedResource: React.FC<ProtectedResourceProps> = ({ token, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  if (!token) {
    return <p>Redirecting to login...</p>;
  }

  return <>{children}</>;
};

export default ProtectedResource;
