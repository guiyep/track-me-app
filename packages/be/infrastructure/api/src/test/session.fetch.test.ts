import { getEnvEntry } from '@track-me-app/env';
import { faker } from '@faker-js/faker';

const apiUrl = getEnvEntry('ApiUrl');

type SessionResponse = {
  data: {
    userId: string;
    sessionId: string | undefined;
  };
};

const userId =
  faker.person.firstName().toLowerCase() +
  '_' +
  faker.person.lastName().toLowerCase();

jest.setTimeout(15000);

describe('Session operations for userId:${userId}', () => {
  test('should complete full session lifecycle', async () => {
    // Start session
    const startResponse = await fetch(
      `${apiUrl}/v1/gps/start-session/${userId}`,
      {
        method: 'POST',
      },
    );

    expect(startResponse.status).toBe(200);
    const sessionId = await startResponse.text();
    expect(sessionId).toBeDefined();
    expect(sessionId.length).toBeGreaterThan(0);

    // Get session
    const getResponse = await fetch(`${apiUrl}/v1/gps/get-session/${userId}`, {
      method: 'GET',
    });

    expect(getResponse.status).toBe(200);
    const getSessionId = await getResponse.text();
    expect(getSessionId).toBe(sessionId);

    // End session
    const endResponse = await fetch(`${apiUrl}/v1/gps/end-session/${userId}`, {
      method: 'POST',
    });

    expect(endResponse.status).toBe(200);
    const endResponseBody = (await endResponse.json()) as SessionResponse;
    expect(endResponseBody.data).toEqual({
      userId,
      sessionId: undefined,
    });

    // Verify session is ended
    const verifyResponse = await fetch(
      `${apiUrl}/v1/gps/get-session/${userId}`,
      {
        method: 'GET',
      },
    );

    expect(verifyResponse.status).toBe(200);
    const { data: verifySessionId } = (await verifyResponse.json()) as {
      data: string | undefined;
    };
    expect(verifySessionId).toBe(undefined);
  });
});
