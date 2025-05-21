import { ReportEntry, type GpsLocation } from '@track-me-app/be-entities';
import { fetcher as fetcherLocation } from './fetchers/location';
import { fetcher as fetcherWeather } from './fetchers/weather';
import { fetcher as fetcherSettings } from './fetchers/settings';
import { logger } from '@track-me-app/logger';
import type { MessageHandler } from '../type';

const loggerA = logger.decorate({
  name: 'locationAddedHandler',
  folder: 'location-added',
});

export const locationAddedHandler: MessageHandler<GpsLocation.Entity> =
  loggerA.asyncFunc(async (entity: GpsLocation.Entity): Promise<void> => {
    const [locationInfo, weatherInfo, userInfo] = await Promise.all([
      fetcherLocation(entity),
      fetcherWeather(entity),
      fetcherSettings(entity),
    ]);

    loggerA.log({ message: 'Location info' }, locationInfo);
    loggerA.log({ message: 'Weather info' }, weatherInfo);
    loggerA.log({ message: 'User info' }, userInfo);

    const report = new ReportEntry.Entity({
      ...ReportEntry.Entity.fromGpsLocation(entity).data,
      locationInfo,
      weatherInfo,
      userInfo,
    });

    loggerA.log({ message: 'Report' }, report);

    // save report
    // await ReportEntry.save(report);
  });
