import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const rfidService = {
  // GET /master/rfid
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/master/rfid`);
    return response.data;
  },

  // POST /master/rfid
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/master/rfid`, data);
    return response.data;
  },

  // PUT /master/rfid/{id}
  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/rfid/${id}`, data);
    return response.data;
  }
};