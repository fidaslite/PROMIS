import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const shiftService = {
  // GET /master/shift
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/master/shift`);
    return response.data;
  },

  // POST /master/shift
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/master/shift`, data);
    return response.data;
  },

  // PUT /master/shift/{id}
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/shift/${id}`, data);
    return response.data;
  }
};