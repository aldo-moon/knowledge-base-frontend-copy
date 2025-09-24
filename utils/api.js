// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sia.aemretail.com/knowledge/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;