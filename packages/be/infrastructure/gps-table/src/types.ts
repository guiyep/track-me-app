export type CellularGeneration = '3g' | '4g' | '5g';

export type GpsInfo = {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  altitudeAccuracy: number;
  heading: number;
  speed: number;
};

export type WifiSignalInfo = {
  type: 'wifi';
  isConnected: boolean;
  strength: number;
  frequency: number;
};

export type CellularSignalInfo = {
  type: 'cellular';
  isConnected: boolean;
  isInternetReachable: boolean;
  cellularGeneration: CellularGeneration;
  carrier: string;
  isConnectionExpensive: boolean;
  strength: number;
};

export type BatteryState = 'charging' | 'discharging' | 'full';
export type ChargingSource = 'AC' | 'USB' | 'wireless' | 'unknown';
export type BatteryHealth = 'good' | 'poor' | 'unknown';

export type BatteryInfo = {
  batteryLevel: number;
  batteryState: BatteryState;
  chargingSource?: ChargingSource;
  chargingStatus: boolean;
  batteryHealth?: BatteryHealth;
};

export type GpsTableLocation = {
  lat: number;
  long: number;
  gpsInfo: GpsInfo;
  signalInfo: WifiSignalInfo | CellularSignalInfo;
  batteryInfo: BatteryInfo;
};

export type GpsTableIdentifiers = {
  userId: string;
  sessionId: string;
};

export type GpsTableTime = {
  created: number;
  lastUpdated: number;
};

export type GpsTableInfo = GpsTableIdentifiers & GpsTableLocation;

export type GpsTableData = GpsTableIdentifiers &
  GpsTableLocation &
  GpsTableTime;

export type GpsTableSchema = {
  partitionKey: string; // [userId]
  sortKey: `sessionId/${string}/created/${number}`; // sessionId/[sessionId]/created/[created]
  data: GpsTableData;
};

export type GpsTableLatestSessionData = {
  userId: string;
  sessionId?: string;
};

export type GpsTableLatestSessionSchema = {
  partitionKey: string; // [userId]
  sortKey: 'latestSession';
  data: GpsTableLatestSessionData;
};

export type UserIdentity = {
  userId: string;
  displayName: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};

export type GpsTableSettingData = UserIdentity & {
  profilePictureUrl?: string;
  isEmailVerified: boolean;
  isPhoneNumberVerified?: boolean;
  hasEmergencyContactSetup?: boolean;
};

export type GpsTableSettingSchema = {
  partitionKey: string; // [userId]
  sortKey: 'setting';
  data: GpsTableSettingData;
};
