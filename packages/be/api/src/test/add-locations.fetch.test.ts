import { getEnvEntry } from '@track-me-app/env';
import { GpsTableData, GpsTableLocation } from '@track-me-app/gps-table';
import { faker } from '@faker-js/faker';
import {
  generateGpsInfo,
  generateWifiSignalInfo,
  generateBatteryInfo,
} from '@track-me-app/testing';

const apiUrl = getEnvEntry('ApiUrl');

type GpsLocationResponse = {
  data: GpsTableData[];
};

const email = faker.person.firstName() + '@' + faker.internet.domainName();
const sessionId = faker.string.uuid();

describe(`With email:${email} - sessionId:${sessionId} `, () => {
  describe('POST /v1/gps/add-locations/:email/:sessionId (add multiple locations)', () => {
    test('should return 200 when correctly called with multiple locations', async () => {
      const locations: GpsTableLocation[] = [
        {
          lat: 1,
          long: 1,
          gpsInfo: generateGpsInfo(1),
          signalInfo: generateWifiSignalInfo(1),
          batteryInfo: generateBatteryInfo(1),
        },
        {
          lat: 2,
          long: 2,
          gpsInfo: generateGpsInfo(2),
          signalInfo: generateWifiSignalInfo(2),
          batteryInfo: generateBatteryInfo(2),
        },
      ];

      const response = await fetch(
        `${apiUrl}/v1/gps/add-locations/${email}/${sessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: locations }),
        },
      );

      const responseBody = (await response.json()) as GpsLocationResponse;
      const locationsData = responseBody.data;

      expect(response.status).toBe(200);
      expect(locationsData).toHaveLength(2);

      expect(locationsData[0]).toEqual(
        expect.objectContaining({
          email,
          lat: 1,
          long: 1,
          sessionId,
          gpsInfo: generateGpsInfo(1),
          signalInfo: generateWifiSignalInfo(1),
          batteryInfo: generateBatteryInfo(1),
        }),
      );

      expect(locationsData[1]).toEqual(
        expect.objectContaining({
          email,
          lat: 2,
          long: 2,
          sessionId,
          gpsInfo: generateGpsInfo(2),
          signalInfo: generateWifiSignalInfo(2),
          batteryInfo: generateBatteryInfo(2),
        }),
      );
    });
  });
});
