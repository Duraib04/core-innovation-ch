import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, PowerMeterReading } from '@/lib/api';
import { useNotifications } from './useNotifications';

export interface MeterData {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'warning' | 'offline';
  lastReading: string;
  power: number;
  voltage: number;
  vln: number;
  current: number;
  powerFactor: number;
  loadPercentage: number;
  // Real database values for energy metrics
  incomingEnergy: number; // forward_active_energy_kwh
  todaysConsumption: number; // todays_consumption_kwh
  liveConsumption: number; // live_consumption_kwh
  totalUnits: number; // units_consumed
  // Phase-specific data from database
  phaseData?: {
    phase1: { power: number; vll: number; vln: number; current: number; loadPercentage: number };
    phase2: { power: number; vll: number; vln: number; current: number; loadPercentage: number };
    phase3: { power: number; vll: number; vln: number; current: number; loadPercentage: number };
  };
}

interface MeterDataContextType {
  meters: MeterData[];
  selectedMeterId: string;
  setSelectedMeterId: (id: string) => void;
  lastUpdate: Date;
  refreshData: () => void;
  refreshRate: number;
  setRefreshRate: (rate: number) => void;
}

const MeterDataContext = createContext<MeterDataContextType | undefined>(undefined);

// Meter name mapping (you can customize these based on your meter IDs)
const meterNameMapping: Record<string, { name: string; location: string }> = {
  "Meter-001": { name: "Main Panel", location: "Main Electrical Room" },
  "Meter-002": { name: "DG Supply", location: "Generator Room" },
  "Meter-003": { name: "Sub Panel", location: "Sub Distribution" },
  "Meter-004": { name: "Lighting Load", location: "Lighting Panel" },
  "Meter-005": { name: "AC Plant", location: "AC Room" },
  // Old format for backward compatibility
  "METER001": { name: "Main Panel", location: "Main Electrical Room" },
  "METER002": { name: "DG Supply", location: "Generator Room" },
  "METER003": { name: "Sub Panel", location: "Sub Distribution" },
  "METER004": { name: "Lighting Load", location: "Lighting Panel" },
  "METER005": { name: "AC Plant", location: "AC Room" },
};

// Convert database reading to MeterData format
const convertToMeterData = (reading: PowerMeterReading): MeterData => {
  const meterId = reading.meter_id;
  const meterInfo = meterNameMapping[meterId] || {
    name: meterId,
    location: "Unknown Location"
  };

  // Calculate time ago
  // Convert DD-MM-YYYY to YYYY-MM-DD for proper Date parsing
  let readingDateTime: Date;
  try {
    const dateParts = reading.date.split('-');
    if (dateParts.length === 3 && dateParts[0].length <= 2) {
      // Date is in DD-MM-YYYY format, convert to YYYY-MM-DD
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      readingDateTime = new Date(`${formattedDate}T${reading.time}`);
    } else {
      // Date is already in YYYY-MM-DD format or other format
      readingDateTime = new Date(`${reading.date}T${reading.time}`);
    }
  } catch (error) {
    console.error('Error parsing date:', error);
    readingDateTime = new Date();
  }
  
  const now = new Date();
  const diffMs = now.getTime() - readingDateTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  let lastReading: string;
  let status: 'online' | 'warning' | 'offline';
  
  if (diffMins < 0) {
    // Future date (clock skew), treat as recent
    lastReading = 'Just now';
    status = 'online';
  } else if (diffMins < 5) {
    lastReading = diffMins === 0 ? 'Just now' : `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    status = 'online';
  } else if (diffMins < 15) {
    lastReading = `${diffMins} minutes ago`;
    status = 'warning';
  } else if (diffMins < 60) {
    lastReading = `${diffMins} minutes ago`;
    status = 'offline';
  } else {
    lastReading = `${Math.floor(diffMins / 60)} hour${Math.floor(diffMins / 60) !== 1 ? 's' : ''} ago`;
    status = 'offline';
  }

  return {
    id: meterId,
    name: meterInfo.name,
    location: meterInfo.location,
    status,
    lastReading,
    power: reading.total_active_power_kw || 0,
    voltage: reading.vll_avg || 0,
    vln: reading.vln_avg || 0,
    current: reading.iavg || 0,
    powerFactor: reading.pf_avg || 0,
    loadPercentage: reading.percent_average_load || 0,
    // Real database values for energy metrics
    incomingEnergy: reading.forward_active_energy_kwh || 0,
    todaysConsumption: reading.todays_consumption_kwh || 0,
    liveConsumption: reading.consumed_energy_kwh || 0,
    totalUnits: reading.units_consumed || 0,
    // Phase-specific data from database
    phaseData: {
      phase1: {
        power: reading.p1_active_kw || 0,
        vll: reading.v12 || 0,
        vln: reading.v1_n || 0,
        current: reading.i1 || 0,
        loadPercentage: Math.round(reading.percent_load_l1 || 0),
      },
      phase2: {
        power: reading.p2_active_kw || 0,
        vll: reading.v23 || 0,
        vln: reading.v2_n || 0,
        current: reading.i2 || 0,
        loadPercentage: Math.round(reading.percent_load_l2 || 0),
      },
      phase3: {
        power: reading.p3_active_kw || 0,
        vll: reading.v31 || 0,
        vln: reading.v3_n || 0,
        current: reading.i3 || 0,
        loadPercentage: Math.round(reading.percent_load_l3 || 0),
      },
    },
  };
};

// Fetch real data from API
const fetchRealTimeData = async (): Promise<MeterData[]> => {
  try {
    console.log('🔍 Fetching real-time data from API...');
    const readings = await apiService.getAllLatestReadings();
    console.log('✅ API response received:', readings.length, 'readings');
    
    if (readings.length === 0) {
      console.warn('⚠️ No readings received from API');
      return [];
    }
    
    const converted = readings.map(convertToMeterData);
    console.log('✅ Converted meter data:', converted.length, 'meters');
    console.log('📊 Sample meter data:', converted[0]);
    return converted;
  } catch (error) {
    console.error('❌ Failed to fetch real-time data from API:', error);
    return []; // Return empty array instead of mock data
  }
};

export function MeterDataProvider({ children }: { children: ReactNode }) {
  const [meters, setMeters] = useState<MeterData[]>([]);
  const [selectedMeterId, setSelectedMeterId] = useState("Meter-001");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshRate, setRefreshRate] = useState(30000); // Default 30 seconds
  const [isLoading, setIsLoading] = useState(true);
  const [previousMeters, setPreviousMeters] = useState<MeterData[]>([]);
  const { addNotification } = useNotifications();

  // Check thresholds and generate notifications
  const checkThresholds = (newMeters: MeterData[], oldMeters: MeterData[]) => {
    newMeters.forEach(meter => {
      const oldMeter = oldMeters.find(m => m.id === meter.id);
      
      // 1. High Load Alert (>85%)
      if (meter.loadPercentage > 85) {
        if (!oldMeter || oldMeter.loadPercentage <= 85) {
          addNotification({
            title: 'High Load Alert',
            message: `${meter.name} is running at ${meter.loadPercentage}% load capacity`,
            type: 'warning'
          });
        }
      }
      
      // 2. Critical Load Alert (>95%)
      if (meter.loadPercentage > 95) {
        if (!oldMeter || oldMeter.loadPercentage <= 95) {
          addNotification({
            title: 'Critical Load Alert',
            message: `${meter.name} has reached ${meter.loadPercentage}% load - immediate action required`,
            type: 'error'
          });
        }
      }
      
      // 3. Low Power Factor Alert (<0.85)
      if (meter.powerFactor < 0.85 && meter.powerFactor > 0) {
        if (!oldMeter || oldMeter.powerFactor >= 0.85) {
          addNotification({
            title: 'Low Power Factor',
            message: `${meter.name} power factor dropped to ${meter.powerFactor.toFixed(2)} - efficiency reduced`,
            type: 'warning'
          });
        }
      }
      
      // 4. Voltage Sag Alert (VLN < 200V or > 250V for 230V system)
      if (meter.vln > 0 && (meter.vln < 200 || meter.vln > 250)) {
        if (!oldMeter || (oldMeter.vln >= 200 && oldMeter.vln <= 250)) {
          addNotification({
            title: 'Voltage Issue',
            message: `${meter.name} voltage ${meter.vln.toFixed(1)}V is outside normal range (200-250V)`,
            type: 'error'
          });
        }
      }
      
      // 5. Device Offline Alert
      if (meter.status === 'offline') {
        if (!oldMeter || oldMeter.status !== 'offline') {
          addNotification({
            title: 'Device Offline',
            message: `${meter.name} has gone offline - last reading: ${meter.lastReading}`,
            type: 'error'
          });
        }
      }
      
      // 6. Device Back Online
      if (meter.status === 'online' && oldMeter && oldMeter.status === 'offline') {
        addNotification({
          title: 'Device Reconnected',
          message: `${meter.name} is back online and operational`,
          type: 'success'
        });
      }
      
      // 7. Phase Imbalance Alert (load difference >30% between phases)
      if (meter.phaseData) {
        const loads = [
          meter.phaseData.phase1.loadPercentage,
          meter.phaseData.phase2.loadPercentage,
          meter.phaseData.phase3.loadPercentage
        ];
        const maxLoad = Math.max(...loads);
        const minLoad = Math.min(...loads);
        const imbalance = maxLoad - minLoad;
        
        if (imbalance > 30) {
          if (!oldMeter || !oldMeter.phaseData) {
            addNotification({
              title: 'Phase Imbalance',
              message: `${meter.name} has ${imbalance.toFixed(0)}% load imbalance between phases`,
              type: 'warning'
            });
          } else {
            const oldLoads = [
              oldMeter.phaseData.phase1.loadPercentage,
              oldMeter.phaseData.phase2.loadPercentage,
              oldMeter.phaseData.phase3.loadPercentage
            ];
            const oldImbalance = Math.max(...oldLoads) - Math.min(...oldLoads);
            if (oldImbalance <= 30) {
              addNotification({
                title: 'Phase Imbalance',
                message: `${meter.name} has ${imbalance.toFixed(0)}% load imbalance between phases`,
                type: 'warning'
              });
            }
          }
        }
      }
      
      // 8. High Power Consumption Alert (power >90% of typical max)
      // Assuming typical max is around 100kW for most meters
      if (meter.power > 90) {
        if (!oldMeter || oldMeter.power <= 90) {
          addNotification({
            title: 'High Power Consumption',
            message: `${meter.name} power consumption is ${meter.power.toFixed(1)} kW`,
            type: 'info'
          });
        }
      }
    });
  };

  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing meter data...');
      const data = await fetchRealTimeData();
      console.log('📊 Setting meters data:', data);
      
      // Check thresholds before updating state
      if (data.length > 0 && previousMeters.length > 0) {
        checkThresholds(data, previousMeters);
      }
      
      setPreviousMeters(data);
      setMeters(data);
      setLastUpdate(new Date());
      setIsLoading(false);
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      // Return empty array on error
      setMeters([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    refreshData();

    // Auto-refresh based on selected refresh rate
    const interval = setInterval(() => {
      refreshData();
    }, refreshRate);

    return () => clearInterval(interval);
  }, [refreshRate]);

  return (
    <MeterDataContext.Provider value={{ meters, selectedMeterId, setSelectedMeterId, lastUpdate, refreshData, refreshRate, setRefreshRate }}>
      {children}
    </MeterDataContext.Provider>
  );
}

export function useMeterData() {
  const context = useContext(MeterDataContext);
  if (context === undefined) {
    throw new Error('useMeterData must be used within a MeterDataProvider');
  }
  return context;
}

// Helper functions to get specific data for selected meter
export function getKeyMetrics(meters: MeterData[], selectedMeterId: string) {
  const selectedMeter = meters.find(m => m.id === selectedMeterId) || meters[0];
  
  // Fallback values if no meter is available
  if (!selectedMeter) {
    return {
      incomingEnergy: { value: 0, unit: "kWh", trend: { value: 0, isPositive: true } },
      todaysConsumption: { value: 0, unit: "kWh", trend: { value: 0, isPositive: true } },
      liveConsumption: { value: 0, unit: "kWh", trend: { value: 0, isPositive: false } },
      totalUnits: { value: 0, unit: "Units", trend: { value: 0, isPositive: true } },
    };
  }
  
  return {
    incomingEnergy: { value: Math.round(selectedMeter.incomingEnergy * 100) / 100, unit: "kWh", trend: { value: 12, isPositive: true } },
    todaysConsumption: { value: Math.round(selectedMeter.todaysConsumption * 100) / 100, unit: "kWh", trend: { value: 8, isPositive: true } },
    liveConsumption: { value: Math.round(selectedMeter.liveConsumption * 100) / 100, unit: "kWh", trend: { value: 3, isPositive: false } },
    totalUnits: { value: Math.round(selectedMeter.totalUnits), unit: "Units", trend: { value: 15, isPositive: true } },
  };
}

export function getAdditionalMetrics(meters: MeterData[], selectedMeterId: string) {
  const selectedMeter = meters.find(m => m.id === selectedMeterId) || meters[0];

  // Fallback values if no meter is available
  if (!selectedMeter) {
    return {
      avgPower: { value: 0, unit: "kW" },
      avgLoad: { value: 0, unit: "%" },
      avgPowerFactor: { value: 0, unit: "P.F" },
      avgVLL: { value: 0, unit: "V" },
      avgVLN: { value: 0, unit: "V" },
      avgCurrent: { value: 0, unit: "A" },
    };
  }

  return {
    avgPower: { value: selectedMeter.power, unit: "kW" },
    avgLoad: { value: selectedMeter.loadPercentage, unit: "%" },
    avgPowerFactor: { value: selectedMeter.powerFactor, unit: "P.F" },
    avgVLL: { value: selectedMeter.voltage, unit: "V" },
    avgVLN: { value: selectedMeter.vln, unit: "V" },
    avgCurrent: { value: selectedMeter.current, unit: "A" },
  };
}

export function getPhaseData(meters: MeterData[], selectedMeterId: string) {
  const selectedMeter = meters.find(m => m.id === selectedMeterId) || meters[0];
  
  // Fallback values if no meter is available
  if (!selectedMeter) {
    return [
      { phase: 1, data: { power: 0, vll: 0, vln: 0, current: 0, loadPercentage: 0 } },
      { phase: 2, data: { power: 0, vll: 0, vln: 0, current: 0, loadPercentage: 0 } },
      { phase: 3, data: { power: 0, vll: 0, vln: 0, current: 0, loadPercentage: 0 } },
    ];
  }
  
  // Use real phase data from database if available
  if (selectedMeter.phaseData) {
    return [
      {
        phase: 1,
        data: {
          power: selectedMeter.phaseData.phase1.power,
          vll: selectedMeter.phaseData.phase1.vll,
          vln: selectedMeter.phaseData.phase1.vln,
          current: selectedMeter.phaseData.phase1.current,
          loadPercentage: selectedMeter.phaseData.phase1.loadPercentage,
        }
      },
      {
        phase: 2,
        data: {
          power: selectedMeter.phaseData.phase2.power,
          vll: selectedMeter.phaseData.phase2.vll,
          vln: selectedMeter.phaseData.phase2.vln,
          current: selectedMeter.phaseData.phase2.current,
          loadPercentage: selectedMeter.phaseData.phase2.loadPercentage,
        }
      },
      {
        phase: 3,
        data: {
          power: selectedMeter.phaseData.phase3.power,
          vll: selectedMeter.phaseData.phase3.vll,
          vln: selectedMeter.phaseData.phase3.vln,
          current: selectedMeter.phaseData.phase3.current,
          loadPercentage: selectedMeter.phaseData.phase3.loadPercentage,
        }
      }
    ];
  }
  
  // Fallback to calculated phase data
  return generateCalculatedPhaseData(selectedMeter);
}

// Helper function to generate calculated phase data (fallback)
function generateCalculatedPhaseData(selectedMeter: MeterData) {
  const phaseVariations = [
    { power: 0.9, voltage: 0.98, vln: 0.97, current: 0.95 },
    { power: 1.1, voltage: 1.02, vln: 1.03, current: 1.05 },
    { power: 1.0, voltage: 1.0, vln: 1.0, current: 1.0 },
  ];

  return phaseVariations.map((variation, index) => ({
    phase: index + 1,
    data: {
      power: Math.round(selectedMeter.power * variation.power),
      vll: selectedMeter.voltage * variation.voltage,
      vln: selectedMeter.vln * variation.vln,
      current: selectedMeter.current * variation.current,
      loadPercentage: Math.round(selectedMeter.loadPercentage * variation.power),
    }
  }));
}