import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import Login from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import Register from '../pages/Register'

interface AppRoutesProps {
  token: string | null;
  setToken: (token: string | null) => void;
}


const ProtectedRoute: React.FC<{ token: string | null; children: JSX.Element }> = ({ token, children }) => {
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

const AppRoutes: React.FC<AppRoutesProps> = ({ token, setToken }) => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login setToken={setToken} />} />
        <Route path="admin/register" element={<Register setToken={setToken}/>}/>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute token={token}>
              <AdminDashboard token={token} setToken={setToken} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
