import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { WifiIcon, BatteryIcon, SignalIcon, ThermometerIcon, FlameIcon, WindIcon, CheckCircleIcon, ClockIcon, MapPinIcon, WrenchIcon, ShieldCheckIcon, RefreshCwIcon, MoreHorizontalIcon, ActivityIcon, PlusIcon } from 'lucide-react';
import { TANDAG_CENTER } from '../utils/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SensorGauge } from '../components/SensorGauge';
import { AlertHistoryTable, Alert } from '../components/AlertHistoryTable';
import { ContactCard, ContactType } from '../components/ContactCard';
import { ContactModal } from '../components/ContactModal';
import { AlertHistoryModal } from '../components/AlertHistoryModal';
import { MaintenanceLogModal } from '../components/MaintenanceLogModal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { LoadingState } from '../components/LoadingState';
import { StatsCard } from '../components/StatsCard';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
// Leaflet Icon Fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
export function UserDashboard() {
  const {
    user
  } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [isSavingContact, setIsSavingContact] = useState(false);
  // Modal States
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAlertHistoryModal, setShowAlertHistoryModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  // Mock Data
  const deviceStatus = {
    id: 'USR-001',
    name: 'Home Sensor Unit',
    isOnline: true,
    battery: 87,
    signal: 92,
    lastSync: 'Just now'
  };
  const sensorReadings = {
    smoke: 12,
    temperature: 28,
    gas: 0.3
  };
  const alerts: Alert[] = [{
    id: 1,
    type: 'warning',
    message: 'Slight temperature increase detected',
    timestamp: '10 mins ago',
    status: 'resolved',
    details: 'Temperature rose to 35°C briefly due to cooking activity. Returned to normal range.'
  }, {
    id: 2,
    type: 'info',
    message: 'System self-check completed',
    timestamp: '2 hours ago',
    status: 'resolved',
    details: 'Routine diagnostic check passed all systems. Battery health optimal.'
  }, {
    id: 3,
    type: 'critical',
    message: 'Smoke detected in kitchen',
    timestamp: 'Yesterday, 2:30 PM',
    status: 'investigating',
    details: 'Smoke sensor triggered in Zone 2 (Kitchen). User confirmed false alarm (burnt toast).'
  }, {
    id: 4,
    type: 'success',
    message: 'Firmware updated successfully',
    timestamp: '2 days ago',
    status: 'resolved',
    details: 'Device updated to version 2.4.1. Security patches applied.'
  }];
  const contacts = [{
    name: 'BFP Emergency',
    number: '0955-710-7810',
    type: 'emergency' as ContactType,
    role: 'Fire Department'
  }, {
    name: 'Barangay Captain',
    number: '0912-345-6789',
    type: 'official' as ContactType,
    role: 'Local Official'
  }, {
    name: 'Family Contact',
    number: '0998-765-4321',
    type: 'personal' as ContactType,
    role: 'Primary Contact'
  }];
  const maintenance = {
    health: 'Good',
    batteryStatus: 'Optimal',
    lastCheck: '15 days ago',
    nextCheck: '75 days'
  };
  // Handlers
  const handleSaveContact = async (contact: any) => {
    setIsSavingContact(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving contact:', contact);
      toast.success('Contact saved successfully!');
      setShowContactModal(false);
    } catch (error) {
      toast.error('Failed to save contact');
    } finally {
      setIsSavingContact(false);
    }
  };
  if (isLoading) {
    return <LoadingState />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pb-20 lg:pb-0">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
      </div>

      <div className="relative z-10 p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="animate-slide-up px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  <span className="text-white">Welcome,</span>
                  <span className="text-gradient-cyan ml-2">
                    {user?.name || 'User'}
                  </span>
                </h1>
              </div>
              <p className="text-slate-400 max-w-2xl">
                Real-time monitoring for {deviceStatus.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setLastSync(new Date())} className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all" title="Refresh Data">
                <RefreshCwIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full relative z-10"></div>
                </div>
                <span className="text-sm font-medium text-emerald-400">
                  System Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Status Grid - Using StatsCard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }}>
            <StatsCard title="Connection" value="Online" icon={WifiIcon} color="green" trend={{
            value: 'Stable',
            positive: true
          }} />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
            <StatsCard title="Battery Level" value={`${deviceStatus.battery}%`} icon={BatteryIcon} color={deviceStatus.battery > 20 ? 'blue' : 'red'} />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }}>
            <StatsCard title="Signal Strength" value={`${deviceStatus.signal}%`} icon={SignalIcon} color="yellow" />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }}>
            <StatsCard title="Last Sync" value={lastSync.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })} icon={ClockIcon} color="blue" />
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sensor Readings & Map Column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Sensor Readings */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SensorGauge label="Smoke Level" value={sensorReadings.smoke} unit="%" max={100} thresholds={{
              warning: 30,
              critical: 60
            }} trend="stable" icon={FlameIcon} />
              <SensorGauge label="Temperature" value={sensorReadings.temperature} unit="°C" max={100} thresholds={{
              warning: 45,
              critical: 60
            }} trend="up" trendValue="+2°C" icon={ThermometerIcon} />
              <SensorGauge label="Gas / CO" value={sensorReadings.gas} unit="ppm" max={10} thresholds={{
              warning: 3,
              critical: 6
            }} trend="stable" icon={WindIcon} />
            </motion.div>

            {/* Location Map */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} className="group relative rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <MapPinIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Device Location
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tandag City, Surigao del Sur
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>

              <div className="h-[300px] relative z-0">
                <MapContainer center={[TANDAG_CENTER.lat, TANDAG_CENTER.lng]} zoom={15} style={{
                height: '100%',
                width: '100%'
              }} scrollWheelZoom={false} dragging={!L.Browser.mobile}>
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; <a href="https://www.esri.com/">Esri</a>' />
                  <Marker position={[TANDAG_CENTER.lat, TANDAG_CENTER.lng]}>
                    <Popup>
                      <div className="text-slate-900 font-bold">
                        Home Sensor Unit
                      </div>
                      <div className="text-slate-600 text-xs">
                        Status: Online
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.div>

            {/* Alert History */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.7
          }}>
              <AlertHistoryTable alerts={alerts} onViewFullHistory={() => setShowAlertHistoryModal(true)} />
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6 lg:space-y-8">
            {/* Maintenance Card */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.6
          }} className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/10 p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <WrenchIcon className="w-32 h-32 text-orange-500" />
              </div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <WrenchIcon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white">System Health</h3>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-400">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
                    <span className="text-sm font-bold text-emerald-400">
                      {maintenance.health}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-400">Last Check</span>
                  <span className="text-sm font-medium text-white">
                    {maintenance.lastCheck}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-400">Next Scheduled</span>
                  <span className="text-sm font-medium text-white">
                    {maintenance.nextCheck}
                  </span>
                </div>
              </div>

              <button onClick={() => setShowMaintenanceModal(true)} className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-white/20 shadow-lg">
                View Maintenance Log
              </button>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.7
          }} className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/10 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Quick Contacts</h3>
                <button onClick={() => setShowContactModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 min-h-[44px] sm:min-h-[40px]">
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Contact</span>
                </button>
              </div>

              <div className="space-y-4">
                {contacts.map((contact, idx) => <ContactCard key={idx} {...contact} onCall={() => console.log(`Calling ${contact.name}`)} onMessage={() => console.log(`Messaging ${contact.name}`)} />)}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} onSave={handleSaveContact} isSaving={isSavingContact} />
      <AlertHistoryModal isOpen={showAlertHistoryModal} onClose={() => setShowAlertHistoryModal(false)} alerts={alerts} />
      <MaintenanceLogModal isOpen={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)} />
    </div>;
}