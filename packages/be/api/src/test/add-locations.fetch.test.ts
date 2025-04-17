import { GpsLocation } from '../routes/gps/add-locations';
import { getEnvEntry } from '@track-me-app/env';

const apiUrl = getEnvEntry('ApiUrl');

type GpsLocationResponse = {
  data: {
    displayName: string;
    email: string;
    lat: number;
    long: number;
    sessionId: string;
    created: number;
    lastUpdated: number;
  }[];
};

describe('POST /v1/gps/add-locations/:email/:sessionId (add multiple locations)', () => {
  test('should return 200 when correctly called with multiple locations', async () => {
    const locations: GpsLocation[] = [
      {
        displayName: 'Location 1',
        lat: 1,
        long: 1,
      },
      {
        displayName: 'Location 2',
        lat: 2,
        long: 2,
      },
    ];

    const response = await fetch(
      `${apiUrl}/v1/gps/add-locations/guiyep@gmail.com/222gh`,
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
        displayName: 'Location 1',
        email: 'guiyep@gmail.com',
        lat: 1,
        long: 1,
        sessionId: '222gh',
      }),
    );

    expect(locationsData[1]).toEqual(
      expect.objectContaining({
        displayName: 'Location 2',
        email: 'guiyep@gmail.com',
        lat: 2,
        long: 2,
        sessionId: '222gh',
      }),
    );
  });
});
