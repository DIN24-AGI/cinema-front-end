import React from 'react';
import Navbar from '../components/NavBar/NavBar';

interface AdminDashboardProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, setToken }) => {
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div>
      <Navbar />
      <h2>Admin Dashboard</h2>
      <p>Welcome, admin!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
