import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getOptions = () => API.get('/api/options');

export const getFilteredData = (filters) =>
  API.post('/api/filter', filters);

export const getMonths = () => API.get('/api/months');
export const getHeatmap = (data) =>
  API.post('/api/heatmap', data, { responseType: 'blob' });

