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
  };
};

describe('POST /gps/add-location/:email/:sessionId (add multiple locations)', () => {
  test('should return 200 when correctly', async () => {
    const location: GpsLocation = {
      displayName: 'Location 1',
      lat: 1,
      long: 1,
    };

    const response = await fetch(
      `${apiUrl}gps/add-location/guiyep@gmail.com/222gh`,
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
        displayName: 'Location 1',
        email: 'guiyep@gmail.com',
        lat: 1,
        long: 1,
        sessionId: '222gh',
      }),
    );
  });
});
