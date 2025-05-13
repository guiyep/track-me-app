import { logger } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import type { FetcherFunction } from '../../type';
import type { ReportTableLocation } from '@track-me-app/report-table';

type LocationInfo = ReportTableLocation['locationInfo'];

export const fetcher: FetcherFunction<GpsLocation.Entity, LocationInfo> =
  logger.asyncFunc(
    async (location: GpsLocation.Entity): Promise<LocationInfo> => {
      logger.log({ message: 'Fetching location info' }, location.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        city: 'New York',
        country: 'United States',
        region: 'NY',
      };
    },
    'fetcher_location',
  );
