import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <nav
      style={{
        backgroundColor: '#03017D',
        padding: '1rem 2rem',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/assets/logo.jpg"
          alt="DemandWise Logo"
          style={{
            height: '40px',
            width: '40px',
            marginRight: '1rem',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>DemandWise</h1>
      </div>

      <button
        onClick={handleAction}
        style={{
          background: '#fff',
          color: '#03017D',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
        }}
      >
        {isLoggedIn ? 'Logout' : 'Login / Signup'}
      </button>
    </nav>
  );
};

export default Navbar;
