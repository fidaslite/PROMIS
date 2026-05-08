import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

export const companyService = {
  // Get all text details
  getDetails: async () => {
    const response = await axios.get(`${API_BASE_URL}/master/company`);
    return response.data;
  },

  // Get binary logo URL
  getLogoUrl: (companyId: number) => {
    return `${API_BASE_URL}/master/company/logo/${companyId}?t=${new Date().getTime()}`;
  },

  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/master/company`, data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await axios.put(`${API_BASE_URL}/master/company/${id}`, data);
    return response.data;
  }
};