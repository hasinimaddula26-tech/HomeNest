import axios from 'axios';
import { API_BASE } from '../config/env';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('homenest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
