import RFIDDeviceMaster from "../pages/masters/RFIDDeviceMaster";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const ENDPOINTS = {
  EMPLOYEES: `${API_BASE_URL}/masters/employees`,
  DEPARTMENTS: `${API_BASE_URL}/masters/departments`,
  DESIGNATION: `${API_BASE_URL}/masters/designation`,
  SHIFT : `${API_BASE_URL}/masters/shifts`,
  LINE : `${API_BASE_URL}/masters/line`,
  MACHINE :`${API_BASE_URL}/masters/machine`,
  RFID :`${API_BASE_URL}/masters/RFID`,
  COLOR :`${API_BASE_URL}/masters/ColorMaster`,
  SIZE :`${API_BASE_URL}/masters/SizeMaster`,
  PRODUCT : `${API_BASE_URL}/masters/ProductMaster`,
  RFIDDEVICEMASTER : `${API_BASE_URL}/masters/RFIDDeviceMaster`,
  TRANSACTIONS: `${API_BASE_URL}/transactions/daily`,
  MQTT_STATUS: `${API_BASE_URL}/settings/mqtt-status`,
};