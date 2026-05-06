import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const departmentService = {
  // GET /master/dept
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/master/dept`);
    return response.data;
  },

  // POST /master/dept
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/master/dept`, data);
    return response.data;
  },

  // PUT /master/dept/{id}
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/dept/${id}`, data);
    return response.data;
  }
};