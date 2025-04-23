import type {
  GpsInfo,
  WifiSignalInfo,
  CellularSignalInfo,
  BatteryInfo,
  CellularGeneration,
} from '@track-me-app/gps-table';

// Simple deterministic random number generator based on seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const generateGpsInfo = (seed: number): GpsInfo => {
  const random = seededRandom(seed);
  return {
    latitude: -90 + random * 180,
    longitude: -180 + seededRandom(seed + 1) * 360,
    altitude: seededRandom(seed + 2) * 1000,
    accuracy: seededRandom(seed + 3) * 50,
    altitudeAccuracy: seededRandom(seed + 4) * 100,
    heading: seededRandom(seed + 5) * 360,
    speed: seededRandom(seed + 6) * 30,
  };
};

export const generateWifiSignalInfo = (seed: number): WifiSignalInfo => {
  const random = seededRandom(seed);
  return {
    type: 'wifi',
    isConnected: random > 0.5,
    strength: Math.floor(random * 100),
    frequency: 2400 + Math.floor(seededRandom(seed + 1) * 1000),
  };
};

export const generateCellularSignalInfo = (
  seed: number,
): CellularSignalInfo => {
  const random = seededRandom(seed);
  const generations: CellularGeneration[] = ['3g', '4g', '5g'];
  const carriers = ['Verizon', 'AT&T', 'T-Mobile', 'Sprint'];

  return {
    type: 'cellular',
    isConnected: random > 0.3,
    isInternetReachable: random > 0.2,
    cellularGeneration:
      generations[Math.floor(seededRandom(seed + 1) * generations.length)],
    carrier: carriers[Math.floor(seededRandom(seed + 2) * carriers.length)],
    isConnectionExpensive: seededRandom(seed + 3) > 0.7,
    strength: Math.floor(seededRandom(seed + 4) * 100),
  };
};

export const generateBatteryInfo = (seed: number): BatteryInfo => {
  const random = seededRandom(seed);
  const states: BatteryInfo['batteryState'][] = [
    'charging',
    'discharging',
    'full',
  ];
  const sources: BatteryInfo['chargingSource'][] = [
    'AC',
    'USB',
    'wireless',
    'unknown',
  ];
  const health: BatteryInfo['batteryHealth'][] = ['good', 'poor', 'unknown'];

  return {
    batteryLevel: Math.floor(random * 100),
    batteryState: states[Math.floor(seededRandom(seed + 1) * states.length)],
    chargingSource:
      sources[Math.floor(seededRandom(seed + 2) * sources.length)],
    chargingStatus: random > 0.5,
    batteryHealth: health[Math.floor(seededRandom(seed + 3) * health.length)],
  };
};

export const generateFakeData = (seed: number) => ({
  gpsInfo: generateGpsInfo(seed),
  wifiSignalInfo: generateWifiSignalInfo(seed),
  cellularSignalInfo: generateCellularSignalInfo(seed),
  batteryInfo: generateBatteryInfo(seed),
});
