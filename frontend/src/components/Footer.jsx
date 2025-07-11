import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        backgroundColor: '#03017D',
        color: '#fff',
        lineHeight: '1.6',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Contact Us</h3>
      <p style={{ margin: 0 }}>
        📞 +91 98765 43210 <br />
        📧 contact@demandwise.com <br />
        📍 Pune, Maharashtra, India
      </p>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
        © 2025 DemandWise
      </p>
    </footer>
  );
};

export default Footer;
