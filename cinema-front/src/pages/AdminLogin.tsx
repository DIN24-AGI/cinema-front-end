import React from 'react';
import AdminLogin from '../components/AdminLogin/AdminLogin';

interface LoginProps {
  setToken: (token: string | null) => void;
}

const Login: React.FC<LoginProps> =( { setToken }) => {
  return (
    <div>
      <h1>Admin Login Page</h1>
      <AdminLogin setToken={setToken} />
    </div>
  );
};

export default Login;
