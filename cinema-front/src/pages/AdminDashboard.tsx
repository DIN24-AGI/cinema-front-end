import React from 'react';
import ProtectedResource from '../components/ProtectedResource/ProtectedResource';

interface AdminDashboardProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, setToken }) => {
  return <ProtectedResource token={token} setToken={setToken} />;
};

export default AdminDashboard;
