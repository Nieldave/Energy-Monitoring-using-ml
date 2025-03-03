import axios from 'axios';
import { EnergyData, Device, Alert, Budget, User } from '../types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication
export const login = (email: string, password: string) => 
  api.post('/auth/login', { username: email, password }); // Changed to match FastAPI OAuth2 format

export const register = (name: string, email: string, password: string) => 
  api.post('/auth/register', { name, email, password });

export const logout = () => 
  api.post('/auth/logout');

// User
export const getCurrentUser = () => 
  api.get<User>('/users/me');

export const updateUserProfile = (userData: Partial<User>) => 
  api.put('/users/me', userData);

// Energy Data
export const getEnergyData = (deviceId?: string, startDate?: string, endDate?: string) => 
  api.get<EnergyData[]>('/energy-data', { params: { deviceId, startDate, endDate } });

export const getRealtimeEnergyData = (deviceId?: string) => 
  api.get<EnergyData[]>('/energy-data/realtime', { params: { deviceId } });

// Devices
export const getDevices = () => 
  api.get<Device[]>('/devices');

export const getDeviceById = (id: string) => 
  api.get<Device>(`/devices/${id}`);

export const updateDevice = (id: string, deviceData: Partial<Device>) => 
  api.put(`/devices/${id}`, deviceData);

// Alerts
export const getAlerts = () => 
  api.get<Alert[]>('/alerts');

export const markAlertAsRead = (id: string) => 
  api.put(`/alerts/${id}/read`);

// Budgets
export const getBudgets = () => 
  api.get<Budget[]>('/budgets');

export const createBudget = (budgetData: Omit<Budget, 'id' | 'currentUsage'>) => 
  api.post('/budgets', budgetData);

export const updateBudget = (id: string, budgetData: Partial<Budget>) => 
  api.put(`/budgets/${id}`, budgetData);

export const deleteBudget = (id: string) => 
  api.delete(`/budgets/${id}`);

// ML Predictions
export const getEnergyForecast = (deviceId: string, days: number) => 
  api.get('/ml/forecast', { params: { deviceId, days } });

export const detectAnomalies = (deviceId: string) => 
  api.get('/ml/anomalies', { params: { deviceId } });

// Voice Commands
export const processVoiceCommand = (command: string) => 
  api.post('/voice/process', { command });

export default api;