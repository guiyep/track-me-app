import { logger } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import type { ReportTableLocation } from '@track-me-app/report-table';
import type { FetcherFunction } from './type';

const KEY = 'weatherInfo';

type WeatherInfo = ReportTableLocation[typeof KEY];

export const fetcher: FetcherFunction<WeatherInfo> = logger.asyncFunc(
  async (location: GpsLocation.Entity): Promise<[typeof KEY, WeatherInfo]> => {
    logger.log({ message: 'Fetching weather info' }, location.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      KEY,
      {
        temperature: 20,
        humidity: 50,
        pressure: 1013,
      },
    ];
  },
);
