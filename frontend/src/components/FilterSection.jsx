import React, { useEffect, useState } from 'react';
import { getOptions, getFilteredData } from '../api/api';

const FilterSection = () => {
  const [cities, setCities] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    product: '',
    timeline: 'Weekly',
    start_date: '',
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    getOptions().then((res) => {
      setCities(res.data.cities);
      setProducts(res.data.products);
    });
  }, []);

  const handleFilter = () => {
    if (!filters.start_date) {
      alert('Please select a start date!');
      return;
    }
    getFilteredData(filters).then((res) => {
      setData(res.data);
    });
  };

  return (
    <section
      style={{
        width: '100%',
        padding: '3rem 2rem',
        margin: '0 auto',
        background: 'transparent', // no visible box
      }}
    >
      <h2 style={{ color: '#03017D', marginBottom: '1rem' }}>Filter Forecast</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <select
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          value={filters.city}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '20px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, product: e.target.value })
          }
          value={filters.product}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '20px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product}>{product}</option>
          ))}
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, timeline: e.target.value })
          }
          value={filters.timeline}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '20px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>

        <input
          type="date"
          value={filters.start_date}
          onChange={(e) =>
            setFilters({ ...filters, start_date: e.target.value })
          }
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '20px',
            border: '1px solid #ccc',
            outline: 'none',
          }}
        />

        <button
          onClick={handleFilter}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#03017D',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
          }}
        >
          Filter
        </button>
      </div>

      <table
        style={{
          borderCollapse: 'collapse',
          width: '60%',
          marginTop: '2rem',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        }}
      >
        <thead style={{ background: '#03017D', color: '#fff' }}>
          <tr>
            <th style={{ padding: '12px' }}>City</th>
            <th style={{ padding: '12px' }}>Date Range</th>
            <th style={{ padding: '12px' }}>Product Name</th>
            <th style={{ padding: '12px' }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? '#f9f9f9' : '#fff',
                }}
              >
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {row.City}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {row['Date Range']}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {row['Product Name']}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {Math.round(row.Quantity)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>
                No data yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default FilterSection;
