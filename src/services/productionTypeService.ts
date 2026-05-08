import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const productionTypeService = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/master/production-type`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/master/production-type`, data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/production-type/${id}`, data);
    return response.data;
  }
};