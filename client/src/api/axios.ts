import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend port
  withCredentials: false,
});

export default api;
