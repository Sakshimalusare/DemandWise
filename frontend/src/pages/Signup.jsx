import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        contact,
        password,
      });

      alert(res.data.message);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Signup failed.');
      }
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
        background: '#ffe6f0', // ✅ pitch pink
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#03017D' }}>Signup</h2>
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
          />

          <label>Contact:</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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
            Signup
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
