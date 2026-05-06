import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const lineService = {
  // GET /master/line
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/master/line`);
    // Your FastAPI code returns [dict, dict] directly
    return response.data; 
  },

  // POST /master/line
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/master/line`, data);
    return response.data;
  },

  // PUT /master/line/{id}
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/line/${id}`, data);
    return response.data;
  }
};