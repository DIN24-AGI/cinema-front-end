import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { API_ENDPOINTS } from '../util/baseURL';
import FormInput from '../components/FormInput/FormInput';


interface RegisterProps {
  setToken: (token: string | null) => void;
}

const Register: React.FC<RegisterProps> = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Registration failed');

      const data = await res.json();
      setToken(data.token || null);
      if (data.token) localStorage.setItem('token', data.token);

      navigate('/admin/dashboard');
    } catch (err) {
      setError('Registration failed. Check console for details.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register New Admin</h2>
      <form onSubmit={handleRegister}>
        <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}

        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
