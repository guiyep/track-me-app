import type { VersionResponseBody } from '../app';
import { getEnvEntry } from '@track-me-app/env';

const apiUrl = getEnvEntry('ApiUrl');

jest.setTimeout(15000);

describe('GET /version', () => {
  test('should return 200 when correctly', async () => {
    const response = await fetch(`${apiUrl}/version`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseBody = (await response.json()) as VersionResponseBody;

    expect(response.status).toBe(200);
    expect(responseBody).toMatchSnapshot();
  });
});
