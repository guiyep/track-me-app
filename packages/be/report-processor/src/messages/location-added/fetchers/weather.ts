import { logger } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import type { ReportTableLocation } from '@track-me-app/report-table';
import type { FetcherFunction } from '../../type';

type WeatherInfo = ReportTableLocation['weatherInfo'];

export const fetcher: FetcherFunction<GpsLocation.Entity, WeatherInfo> =
  logger.asyncFunc(
    async (location: GpsLocation.Entity): Promise<WeatherInfo> => {
      logger.log({ message: 'Fetching weather info' }, location.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        temperature: 20,
        humidity: 50,
        pressure: 1013,
      };
    },
  );
