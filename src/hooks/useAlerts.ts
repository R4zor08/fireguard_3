import { useState, useEffect } from 'react';
import { Alert } from '../types';
import { mockAlerts } from '../utils/mockData';
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => alert.id === alertId ? {
      ...alert,
      acknowledged: true
    } : alert));
  };
  return {
    alerts,
    acknowledgeAlert
  };
}