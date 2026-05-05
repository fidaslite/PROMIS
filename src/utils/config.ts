export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const ENDPOINTS = {
  EMPLOYEES: `${API_BASE_URL}/masters/employees`,
  DEPARTMENTS: `${API_BASE_URL}/master/dept`,
  DESIGNATION: `${API_BASE_URL}/master/designation`,
  TRANSACTIONS: `${API_BASE_URL}/transactions/daily`,
  MQTT_STATUS: `${API_BASE_URL}/settings/mqtt-status`,
};