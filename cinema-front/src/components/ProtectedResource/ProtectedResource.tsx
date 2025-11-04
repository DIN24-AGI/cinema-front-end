import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface ProtectedResourceProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const API_URL = 'http://localhost:3000';

const ProtectedResource: React.FC<ProtectedResourceProps> = ({ token, setToken }) => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      if (!token) {
        setError('No token found. Please login first.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/protected-resource`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        } else if (response.status === 401) {
          setError('Unauthorized. Token invalid or expired.');
          setToken(null);
          setTimeout(() => navigate('/admin/login'), 2000);
        } else {
          setError('Failed to fetch protected resource.');
        }
      } catch (err) {
        setError('Network error. Make sure backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, [token, setToken, navigate]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {data && <p>{data}</p>}
      {error && <p>{error}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProtectedResource;
