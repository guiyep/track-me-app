import { logger } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import type { FetcherFunction } from './type';
import type { ReportTableLocation } from '@track-me-app/report-table';

const KEY = 'locationInfo';

type LocationInfo = ReportTableLocation[typeof KEY];

export const fetcher: FetcherFunction<LocationInfo> = logger.asyncFunc(
  async (location: GpsLocation.Entity): Promise<[typeof KEY, LocationInfo]> => {
    logger.log({ message: 'Fetching location info' }, location.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      KEY,
      {
        city: 'New York',
        country: 'United States',
        region: 'NY',
      },
    ];
  },
);
