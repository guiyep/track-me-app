import { ReportEntry, type GpsLocation } from '@track-me-app/be-entities';
import { fetcher as fetcherLocation } from './fetchers/location';
import { fetcher as fetcherWeather } from './fetchers/weather';
import { logger } from '@track-me-app/logger';
import type { MessageHandler } from '../type';

export const locationAddedHandler: MessageHandler<GpsLocation.Entity> =
  logger.asyncFunc(async (entity: GpsLocation.Entity): Promise<void> => {
    const [locationInfo, weatherInfo] = await Promise.all([
      fetcherLocation(entity),
      fetcherWeather(entity),
    ]);

    logger.log({ message: 'Location info' }, locationInfo);
    logger.log({ message: 'Weather info' }, weatherInfo);

    const report = new ReportEntry.Entity({
      ...ReportEntry.Entity.fromGpsLocation(entity).data,
      ...locationInfo,
      ...weatherInfo,
    });

    logger.log({ message: 'Report' }, report);

    // save report
    await ReportEntry.save(report);
  });
