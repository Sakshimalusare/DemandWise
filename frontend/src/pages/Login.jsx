import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      alert(res.data.message);

      if (res.data.message.includes('successful')) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard');
      }

    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem 0'
    }}>
      <div style={{
        background: '#ffe6f0',
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#03017D' }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />

          <button
            type="submit"
            style={{
              background: '#03017D',
              color: '#fff',
              padding: '0.7rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
