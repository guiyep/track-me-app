import { logger } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import type { ReportTableLocation } from '@track-me-app/report-table';
import type { FetcherFunction } from '../../type';
import type { WeatherFetchData } from './types';
import { fetch } from 'undici';

type WeatherInfo = ReportTableLocation['weatherInfo'];

const loggerA = logger.decorate({
  name: 'getCurrentWeather',
  folder: 'location-added/fetchers/weather',
});

const getCurrentWeather = loggerA.asyncFunc(
  async (lat: number, lon: number): Promise<WeatherFetchData> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toString()}&longitude=${lon.toString()}&current_weather=true`;

    loggerA.log({ message: `Fetching weather info ${url}` });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status.toString()}`);
    }

    const data = (await response.json()) as WeatherFetchData;

    loggerA.log({ message: `Weather data ${JSON.stringify(data)}` });
    return data;
  },
);

const loggerB = logger.decorate({
  name: 'fetcher',
  folder: 'location-added/fetchers/weather',
});

export const fetcher: FetcherFunction<GpsLocation.Entity, WeatherInfo> =
  loggerB.asyncFunc(
    async (location: GpsLocation.Entity): Promise<WeatherInfo> => {
      const weather = await getCurrentWeather(
        location.data.lat,
        location.data.long,
      );
      return {
        temperature: weather.current_weather.temperature,
      };
    },
  );
