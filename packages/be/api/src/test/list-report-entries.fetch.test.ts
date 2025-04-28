import { getEnvEntry } from '@track-me-app/env';
import { faker } from '@faker-js/faker';
import type { ReportTable } from '@track-me-app/report-table';
import {
  generateBatteryInfo,
  generateWifiSignalInfo,
  generateGpsInfo,
} from '@track-me-app/testing';
import type { GpsTableLocation } from '@track-me-app/gps-table';

const apiUrl = getEnvEntry('ApiUrl');
const graphqlUrl = getEnvEntry('GraphqlUrl');
const graphqlKey = getEnvEntry('GraphqlKey');

const userId =
  faker.person.firstName().toLowerCase() +
  '_' +
  faker.person.lastName().toLowerCase();

const sessionId = faker.string.uuid();

type ListReportEntriesResponse = {
  listReportEntries: ReportTable[];
};

type GraphQLResponse<T> = {
  data: T;
  errors?: {
    message: string;
  }[];
};

jest.setTimeout(15000);

describe(`With userId:${userId} sessionId:${sessionId}`, () => {
  describe('POST /graphql (list report entries)', () => {
    test('should return 200 and list report entries', async () => {
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

      await fetch(`${apiUrl}/v1/gps/add-locations/${userId}/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: locations }),
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const query = `
        query ListReportEntries($partitionKey: String) {
          listReportEntries(partitionKey: $partitionKey) {
            partitionKey
            sortKey
            data {
              userId
              sessionId
            }
          }
        }
      `;

      const response = await fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': graphqlKey,
        },
        body: JSON.stringify({
          query,
          variables: {
            partitionKey: sessionId,
          },
        }),
      });

      const responseBody =
        (await response.json()) as GraphQLResponse<ListReportEntriesResponse>;

      expect(response.status).toBe(200);
      expect(responseBody.data).toBeDefined();
      expect(responseBody.data.listReportEntries).toBeDefined();
      expect(Array.isArray(responseBody.data.listReportEntries)).toBe(true);
    });
  });
});
