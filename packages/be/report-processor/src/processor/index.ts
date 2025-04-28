import { ReportEntry, type GpsLocation } from '@track-me-app/be-entities';
import { fetcher as fetcherLocation } from './transformers/location';
import { fetcher as fetcherWeather } from './transformers/weather';
import { logger } from '@track-me-app/logger';

const fetchers = [fetcherLocation, fetcherWeather];

export const transform = logger.asyncFunc(
  async (location: GpsLocation.Entity): Promise<ReportEntry.Entity> => {
    const result = await Promise.all(
      fetchers.map((fetcher) => fetcher(location)),
    );

    logger.log({ message: 'Hydrated Report' }, result);

    return new ReportEntry.Entity({
      ...location.data,
      ...result.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    });
  },
);
