import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const colorService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/master/color`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/master/color`, data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/color/${id}`, data);
    return response.data;
  }
};