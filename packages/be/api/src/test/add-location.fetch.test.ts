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

const email = faker.person.firstName() + '@' + faker.internet.domainName();
const sessionId = faker.string.uuid();

describe(`With email:${email} - sessionId:${sessionId} `, () => {
  describe(`POST - /v1/gps/add-location/:email/:sessionId (add multiple locations)`, () => {
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
        `${apiUrl}/v1/gps/add-location/${email}/${sessionId}`,
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
          email,
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
