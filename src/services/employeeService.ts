import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const employeeService = {
  // GET /employee
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/employee`);
    return response.data;
  },

  // POST /employee
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/employee`, data);
    return response.data;
  },

  // PUT /master/employee/{id}
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/employee/${id}`, data);
    return response.data;
  }
};