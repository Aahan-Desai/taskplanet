import axios from 'axios';

// Update URL string with your hosted Render URL during deployment step
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically inject JWT string before outgoing server requests
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('taskplanet_user');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;