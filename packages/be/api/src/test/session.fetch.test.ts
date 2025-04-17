import { getEnvEntry } from '@track-me-app/env';
import { faker } from '@faker-js/faker';

const apiUrl = getEnvEntry('ApiUrl');

type SessionResponse = {
  data: {
    email: string;
    sessionId: string | undefined;
  };
};

describe('Session operations', () => {
  const testEmail = `${faker.person.firstName()}@${faker.internet.domainName()}`;

  test('should complete full session lifecycle', async () => {
    // Start session
    const startResponse = await fetch(
      `${apiUrl}/v1/gps/start-session/${testEmail}`,
      {
        method: 'POST',
      },
    );

    expect(startResponse.status).toBe(200);
    const sessionId = await startResponse.text();
    expect(sessionId).toBeDefined();
    expect(sessionId.length).toBeGreaterThan(0);

    // Get session
    const getResponse = await fetch(
      `${apiUrl}/v1/gps/get-session/${testEmail}`,
      {
        method: 'GET',
      },
    );

    expect(getResponse.status).toBe(200);
    const getSessionId = await getResponse.text();
    expect(getSessionId).toBe(sessionId);

    // End session
    const endResponse = await fetch(
      `${apiUrl}/v1/gps/end-session/${testEmail}`,
      {
        method: 'POST',
      },
    );

    expect(endResponse.status).toBe(200);
    const endResponseBody = (await endResponse.json()) as SessionResponse;
    expect(endResponseBody.data).toEqual({
      email: testEmail,
      sessionId: undefined,
    });

    // Verify session is ended
    const verifyResponse = await fetch(
      `${apiUrl}/v1/gps/get-session/${testEmail}`,
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
