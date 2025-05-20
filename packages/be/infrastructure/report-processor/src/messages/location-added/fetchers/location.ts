import { loggerDecorator } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import type { FetcherFunction } from '../../type';
import type { ReportTableLocation } from '@track-me-app/report-table';
import type { LocationFetchData } from './types';
import path from 'path';

type LocationInfo = ReportTableLocation['locationInfo'];

const logger1 = loggerDecorator('getLocationInfo', path.basename(__dirname));

const getLocationInfo = logger1.asyncFunc(
  async (lat: number, lon: number): Promise<LocationFetchData> => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat.toString()}&lon=${lon.toString()}&format=json`;

    logger1.log({ message: `URL ${url}` });

    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status.toString()}`);
    }

    const data = (await response.json()) as LocationFetchData;

    if (data.error != null) {
      throw new Error(
        `Error for lat:${lat.toString()}, lon:${lon.toString()} ${data.error}`,
      );
    }

    logger1.log({
      message: `Data for lat:${lat.toString()}, lon:${lon.toString()} ${JSON.stringify(
        data,
      )}`,
    });

    return data;
  },
);

const logger2 = loggerDecorator('fetcher', path.basename(__dirname));

export const fetcher: FetcherFunction<GpsLocation.Entity, LocationInfo> =
  logger2.asyncFunc(
    async (location: GpsLocation.Entity): Promise<LocationInfo> => {
      const locationInfo = await getLocationInfo(
        location.data.lat,
        location.data.long,
      );

      return {
        city: locationInfo.address.city,
        country: locationInfo.address.country,
        region: locationInfo.address.state,
      };
    },
  );
