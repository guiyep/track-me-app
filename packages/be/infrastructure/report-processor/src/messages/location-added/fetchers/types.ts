type CurrentWeatherUnits = {
  time: string; // "iso8601"
  interval: string; // "seconds"
  temperature: string; // "°C"
  windspeed: string; // "km/h"
  winddirection: string; // "°"
  is_day: string; // ""
  weathercode: string; // "wmo code"
};

type CurrentWeather = {
  time: string; // e.g., "2025-05-14T10:30"
  interval: number; // e.g., 900
  temperature: number; // e.g., 28.2
  windspeed: number; // e.g., 14.9
  winddirection: number; // e.g., 172
  is_day: number; // e.g., 1
  weathercode: number; // e.g., 2
};

export type WeatherFetchData = {
  latitude: number; // e.g., 1
  longitude: number; // e.g., 1
  generationtime_ms: number; // e.g., 0.026941299438476562
  utc_offset_seconds: number; // e.g., 0
  timezone: string; // "GMT"
  timezone_abbreviation: string; // "GMT"
  elevation: number; // e.g., 0
  current_weather_units: CurrentWeatherUnits;
  current_weather: CurrentWeather;
};

type LocationAddress = {
  building?: string;
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  borough?: string;
  city?: string;
  municipality?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
};

export type LocationFetchData = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name?: string;
  display_name: string;
  address: LocationAddress;
  boundingbox: [string, string, string, string];
  error?: string;
};
