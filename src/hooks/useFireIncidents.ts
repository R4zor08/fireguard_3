import { useState, useEffect } from 'react';
import { FireIncident } from '../types';
import { mockFireIncidents } from '../utils/mockData';
export function useFireIncidents() {
  const [incidents, setIncidents] = useState<FireIncident[]>(mockFireIncidents);
  const [loading, setLoading] = useState(false);

  // Simulate real-time incident updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents(prev => prev.map(incident => {
        // Don't update resolved incidents
        if (incident.status === 'resolved') return incident;

        // Randomly progress incident status
        const random = Math.random();
        let newStatus = incident.status;
        if (incident.status === 'active' && random > 0.7) {
          newStatus = 'responding';
        } else if (incident.status === 'responding' && random > 0.8) {
          newStatus = 'contained';
        } else if (incident.status === 'contained' && random > 0.9) {
          newStatus = 'resolved';
        }
        return {
          ...incident,
          status: newStatus,
          resolvedAt: newStatus === 'resolved' ? new Date() : incident.resolvedAt
        };
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved');
  return {
    incidents,
    activeIncidents,
    criticalIncidents,
    loading
  };
}