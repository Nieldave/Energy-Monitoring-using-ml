export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface EnergyData {
  timestamp: string;
  value: number;
  deviceId: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'online' | 'offline';
}

export interface Alert {
  id: string;
  type: 'budget' | 'anomaly' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
  period: 'daily' | 'weekly' | 'monthly';
  currentUsage: number;
}