import type {
  GpsInfo,
  WifiSignalInfo,
  CellularSignalInfo,
  BatteryState,
  ChargingSource,
  BatteryHealth,
  UserIdentity,
} from '@track-me-app/gps-table';

export type BatteryInfo = {
  batteryLevel: number;
  batteryState: BatteryState;
  chargingSource?: ChargingSource;
  chargingStatus: boolean;
  batteryHealth?: BatteryHealth;
};

export type WeatherInfo = {
  temperature: number;
  humidity: number;
  pressure: number;
};

export type LocationInfo = {
  city: string;
  country: string;
  region: string;
};

export type ReportTableTime = {
  created: number;
  lastUpdated: number;
};

export type TimeInfo = {
  sentDate: number;
};

export type ReportTableLocation = {
  lat: number;
  long: number;
  gpsInfo: GpsInfo;
  signalInfo: WifiSignalInfo | CellularSignalInfo;
  batteryInfo: BatteryInfo;
  userInfo?: UserInfo;
  weatherInfo?: WeatherInfo;
  locationInfo?: LocationInfo;
  timeInfo?: TimeInfo;
};

export type UserInfo = UserIdentity;

export type ReportTableIdentifiers = {
  userId: string;
  sessionId: string;
};

export type ReportTableData = ReportTableIdentifiers &
  ReportTableLocation &
  ReportTableTime;

export type ReportTableSchema = {
  partitionKey: string; // [sessionId]
  sortKey: string; // tracking:[email1],[email2],[email3],...
  data: ReportTableData;
};
