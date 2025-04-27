import { getEnvEntry } from '@track-me-app/env';
import { faker } from '@faker-js/faker';
import { fetch } from 'undici';
import type { GpsTableLocation, GpsTableData } from '@track-me-app/gps-table';
import {
  generateGpsInfo,
  generateWifiSignalInfo,
  generateBatteryInfo,
} from '@track-me-app/testing';

const apiUrl = getEnvEntry('ApiUrl');

type GpsLocationResponse = {
  data: GpsTableData;
};

const userId =
  faker.person.firstName().toLowerCase() +
  '_' +
  faker.person.lastName().toLowerCase();
const sessionId = faker.string.uuid();

jest.setTimeout(15000);

describe(`With userId:${userId} - sessionId:${sessionId} `, () => {
  describe(`POST - /v1/gps/add-location/:userId/:sessionId (add multiple locations)`, () => {
    test('should return 200 when correctly', async () => {
      const gpsInfo = generateGpsInfo(1);
      const signalInfo = generateWifiSignalInfo(1);
      const batteryInfo = generateBatteryInfo(1);

      const location: GpsTableLocation = {
        lat: 1,
        long: 1,
        gpsInfo,
        signalInfo,
        batteryInfo,
      };

      const response = await fetch(
        `${apiUrl}/v1/gps/add-location/${userId}/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(location),
        },
      );

      const responseBody = (await response.json()) as GpsLocationResponse;

      expect(response.status).toBe(200);

      expect(responseBody.data).toEqual(
        expect.objectContaining({
          userId,
          lat: 1,
          long: 1,
          sessionId,
          gpsInfo,
          signalInfo,
          batteryInfo,
        }),
      );
    });
  });
});
