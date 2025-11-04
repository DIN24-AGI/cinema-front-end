import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import Register from '../pages/Register'

interface AppRoutesProps {
  token: string | null;
  setToken: (token: string | null) => void;
}


const ProtectedResource: React.FC<{ token: string | null; children: JSX.Element }> = ({ token, children }) => {
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

const AppRoutes: React.FC<AppRoutesProps> = ({ token, setToken }) => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin setToken={setToken} />} />
        <Route path="admin/register" element={<Register setToken={setToken}/>}/>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedResource token={token}>
              <AdminDashboard token={token} setToken={setToken} />
            </ProtectedResource>
  }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
