import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import './index.css';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  return <AppRoutes token={token} setToken={setToken} />;
};

export default App;