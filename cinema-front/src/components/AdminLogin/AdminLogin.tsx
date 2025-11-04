import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';

interface AdminLoginProps {
  setToken: (token: string | null) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');

      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        Don't have an account? <Link to="/admin/register">Register</Link>
      </p>
    </div>
  );
};

export default AdminLogin;
