import axios from 'axios';
import { API_BASE } from '../config/env';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});
