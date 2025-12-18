import { useState, useEffect } from 'react';
import { Device } from '../types';
import { mockDevices } from '../utils/mockData';
export function useDevices() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [loading, setLoading] = useState(false);

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => {
        if (!device.isOnline) return device;

        // Randomly update sensor readings slightly
        const newReading = {
          smoke: Math.max(0, Math.min(100, device.lastReading.smoke + (Math.random() - 0.5) * 5)),
          temperature: Math.max(20, Math.min(80, device.lastReading.temperature + (Math.random() - 0.5) * 2)),
          gas: Math.max(0, Math.min(100, device.lastReading.gas + (Math.random() - 0.5) * 3)),
          timestamp: new Date()
        };

        // Update status based on readings
        let status: Device['status'] = 'normal';
        if (newReading.smoke > 70 || newReading.temperature > 60 || newReading.gas > 80) {
          status = 'triggered';
        } else if (newReading.smoke > 30 || newReading.temperature > 35 || newReading.gas > 25) {
          status = 'warning';
        }
        return {
          ...device,
          lastReading: newReading,
          status
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return {
    devices,
    loading
  };
}