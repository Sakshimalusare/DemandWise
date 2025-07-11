import React, { useEffect, useState } from 'react';
import { getMonths, getHeatmap } from '../api/api';

const HeatmapSection = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [heatmapUrl, setHeatmapUrl] = useState('');

  useEffect(() => {
    getMonths().then((res) => {
      setMonths(res.data.months);
    });
  }, []);

  const handleHeatmap = () => {
    if (!selectedMonth) {
      alert('Please select a month!');
      return;
    }
    getHeatmap({ month: selectedMonth }).then((res) => {
      const imageUrl = URL.createObjectURL(res.data);
      setHeatmapUrl(imageUrl);
    });
  };

  return (
    <section
      style={{
        width: '100%',
        padding: '3rem 2rem',
        margin: '0 auto',
        background: 'transparent',
        
      }}
    >
      <h2 style={{ color: '#03017D', marginBottom: '1rem' }}>
        Generate Heatmap for Selected Month
      </h2>

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '20px',
          border: '1px solid #ccc',
          outline: 'none',
          marginRight: '1rem',
        }}
      >
        <option value="">Select Month</option>
        {months.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <button
        onClick={handleHeatmap}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#03017D',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
        }}
      >
        Generate Heatmap
      </button>

      {heatmapUrl && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center', // ✅ center horizontally
            marginTop: '2rem',
          }}
        >
          <img
            src={heatmapUrl}
            alt="Heatmap"
            style={{
              maxWidth: '90%',
              height: 'auto',
              borderRadius: '12px',
              border: '2px solid #03017D',
              boxShadow: '0 0 10px rgba(0,0,0,0.05)',
            }}
          />
        </div>
      )}
    </section>
  );
};

export default HeatmapSection;
