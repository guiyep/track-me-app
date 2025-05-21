import { logger } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import type { FetcherFunction } from '../../type';
import type { ReportTableLocation } from '@track-me-app/report-table';

type UserInfo = ReportTableLocation['userInfo'];

const loggerA = logger.decorate({
  name: 'fetcher',
  folder: 'location-added/fetchers/settings',
});

export const fetcher: FetcherFunction<GpsLocation.Entity, UserInfo> =
  loggerA.asyncFunc(async (location: GpsLocation.Entity): Promise<UserInfo> => {
    loggerA.log({ message: 'Fetching location info' }, location.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      userId: '123',
      displayName: 'John Doe',
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
  });
