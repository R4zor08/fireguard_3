export type DeviceStatus = 'normal' | 'warning' | 'triggered' | 'offline';
export interface SensorReadings {
  smoke: number; // 0-100%
  temperature: number; // Celsius
  gas: number; // PPM
  timestamp: Date;
}
export interface Device {
  id: string;
  status: DeviceStatus;
  ownerName: string;
  address: string;
  latitude: number;
  longitude: number;
  lastReading: SensorReadings;
  isOnline: boolean;
  batteryLevel?: number;
  signalStrength?: number;
  firmwareVersion?: string;
}
export interface Alert {
  id: string;
  deviceId: string;
  type: 'smoke' | 'heat' | 'gas' | 'fire';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  responseTime?: number;
}
export interface DashboardStats {
  totalHouses: number;
  activeDevices: number;
  triggersToday: number;
  highRiskAreas: number;
}
export interface RiskArea {
  latitude: number;
  longitude: number;
  radius: number;
  riskScore: number; // 0-100
  incidents: number;
}
export interface Household {
  id: string;
  ownerName: string;
  address: string;
  latitude: number;
  longitude: number;
  deviceCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastIncident?: Date;
  contactNumber: string;
}
export interface NetworkNode {
  id: string;
  type: 'iot' | 'cluster' | 'server' | 'bfp';
  status: 'online' | 'offline' | 'degraded';
  name: string;
  connectedTo?: string[];
  latency?: number;
}
export interface SystemHealth {
  uptime: number;
  apiResponseTime: number;
  databaseStatus: 'healthy' | 'degraded' | 'down';
  messageQueueDepth: number;
  activeConnections: number;
}
export interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'maintenance' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}
export interface FireIncident {
  id: string;
  deviceId?: string;
  type: 'active_fire' | 'smoke_detected' | 'heat_anomaly' | 'gas_leak' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  address: string;
  detectedAt: Date;
  resolvedAt?: Date;
  affectedHouseholds: number;
  responseUnits?: string[];
  estimatedDamage?: string;
  status: 'active' | 'responding' | 'contained' | 'resolved';
  description: string;
}