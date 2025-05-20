import { ReportEntry, type GpsLocation } from '@track-me-app/be-entities';
import { fetcher as fetcherLocation } from './fetchers/location';
import { fetcher as fetcherWeather } from './fetchers/weather';
import { fetcher as fetcherSettings } from './fetchers/settings';
import { loggerDecorator } from '@track-me-app/logger';
import type { MessageHandler } from '../type';

const logger = loggerDecorator('location_added_handler');

export const locationAddedHandler: MessageHandler<GpsLocation.Entity> =
  logger.asyncFunc(async (entity: GpsLocation.Entity): Promise<void> => {
    const [locationInfo, weatherInfo, userInfo] = await Promise.all([
      fetcherLocation(entity),
      fetcherWeather(entity),
      fetcherSettings(entity),
    ]);

    logger.log({ message: 'Location info' }, locationInfo);
    logger.log({ message: 'Weather info' }, weatherInfo);
    logger.log({ message: 'User info' }, userInfo);

    const report = new ReportEntry.Entity({
      ...ReportEntry.Entity.fromGpsLocation(entity).data,
      locationInfo,
      weatherInfo,
      userInfo,
    });

    logger.log({ message: 'Report' }, report);

    // save report
    await ReportEntry.save(report);
  });
