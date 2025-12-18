import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangleIcon, FlameIcon, CheckCircleIcon, DownloadIcon, FilterIcon, SearchIcon, CalendarIcon } from 'lucide-react';
import { AlertHistoryTable, Alert } from '../components/AlertHistoryTable';
import { StatsCard } from '../components/StatsCard';
import { LoadingState } from '../components/LoadingState';
// Extended mock data
const mockAlerts: Alert[] = [{
  id: 1,
  type: 'warning',
  message: 'Slight temperature increase detected',
  timestamp: '2025-05-15 14:30',
  status: 'resolved',
  details: 'Temperature rose to 35°C briefly due to cooking activity. Returned to normal range.'
}, {
  id: 2,
  type: 'info',
  message: 'System self-check completed',
  timestamp: '2025-05-15 12:00',
  status: 'resolved',
  details: 'Routine diagnostic check passed all systems. Battery health optimal.'
}, {
  id: 3,
  type: 'critical',
  message: 'Smoke detected in kitchen',
  timestamp: '2025-05-14 14:30',
  status: 'investigating',
  details: 'Smoke sensor triggered in Zone 2 (Kitchen). User confirmed false alarm (burnt toast).'
}, {
  id: 4,
  type: 'success',
  message: 'Firmware updated successfully',
  timestamp: '2025-05-12 09:15',
  status: 'resolved',
  details: 'Device updated to version 2.4.1. Security patches applied.'
}, {
  id: 5,
  type: 'warning',
  message: 'Low battery warning (15%)',
  timestamp: '2025-05-10 18:45',
  status: 'resolved',
  details: 'Battery level dropped below 15%. Device charged successfully.'
}, {
  id: 6,
  type: 'info',
  message: 'WiFi connection restored',
  timestamp: '2025-05-10 10:20',
  status: 'resolved',
  details: 'Connection re-established after brief outage.'
}, {
  id: 7,
  type: 'critical',
  message: 'High gas levels detected',
  timestamp: '2025-05-08 19:30',
  status: 'resolved',
  details: 'LPG leak detected. Valve closed manually. Area ventilated.'
}, {
  id: 8,
  type: 'info',
  message: 'Weekly report generated',
  timestamp: '2025-05-07 08:00',
  status: 'resolved',
  details: 'Weekly safety summary available for download.'
}];
export function UserAlerts() {
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const filteredAlerts = alerts.filter(alert => alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || alert.details?.toLowerCase().includes(searchQuery.toLowerCase()));
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    active: alerts.filter(a => a.status !== 'resolved').length
  };
  if (isLoading) return <LoadingState />;
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-8 pb-20 lg:pb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alert History</h1>
          <p className="text-slate-400">
            View and manage all system notifications and incidents
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all">
          <DownloadIcon className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{
      animationDelay: '0.1s'
    }}>
        <StatsCard title="Total Alerts" value={stats.total} icon={AlertTriangleIcon} color="blue" />
        <StatsCard title="Critical Incidents" value={stats.critical} icon={FlameIcon} color="red" />
        <StatsCard title="Active Issues" value={stats.active} icon={AlertTriangleIcon} color="yellow" />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircleIcon} color="green" />
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{
      animationDelay: '0.2s'
    }}>
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search alerts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="animate-slide-up" style={{
      animationDelay: '0.3s'
    }}>
        <AlertHistoryTable alerts={filteredAlerts} />
      </div>
    </div>;
}