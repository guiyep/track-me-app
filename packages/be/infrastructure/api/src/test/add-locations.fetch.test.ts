import { getEnvEntry } from '@track-me-app/env';
import type { GpsTableData, GpsTableLocation } from '@track-me-app/gps-table';
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

const userId =
  faker.person.firstName().toLowerCase() +
  '_' +
  faker.person.lastName().toLowerCase();
const sessionId = faker.string.uuid();

jest.setTimeout(15000);

describe(`With userId:${userId} - sessionId:${sessionId} `, () => {
  describe('POST /v1/gps/add-locations/:userId/:sessionId (add multiple locations)', () => {
    test('should return 200 when correctly called with multiple locations', async () => {
      const locations: GpsTableLocation[] = [
        {
          lat: 12,
          long: 12,
          gpsInfo: generateGpsInfo(1),
          signalInfo: generateWifiSignalInfo(1),
          batteryInfo: generateBatteryInfo(1),
        },
        {
          lat: 22,
          long: 22,
          gpsInfo: generateGpsInfo(2),
          signalInfo: generateWifiSignalInfo(2),
          batteryInfo: generateBatteryInfo(2),
        },
      ];

      const response = await fetch(
        `${apiUrl}/v1/gps/add-locations/${userId}/${sessionId}`,
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
          userId,
          lat: 12,
          long: 12,
          sessionId,
          gpsInfo: generateGpsInfo(1),
          signalInfo: generateWifiSignalInfo(1),
          batteryInfo: generateBatteryInfo(1),
        }),
      );

      expect(locationsData[1]).toEqual(
        expect.objectContaining({
          userId,
          lat: 22,
          long: 22,
          sessionId,
          gpsInfo: generateGpsInfo(2),
          signalInfo: generateWifiSignalInfo(2),
          batteryInfo: generateBatteryInfo(2),
        }),
      );
    });
  });
});
