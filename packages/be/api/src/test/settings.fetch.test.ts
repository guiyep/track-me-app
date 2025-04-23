import { getEnvEntry } from '@track-me-app/env';
import { faker } from '@faker-js/faker';
import { fetch } from 'undici';
import type { GpsTableSettingData } from '@track-me-app/gps-table';

const apiUrl = getEnvEntry('ApiUrl');

type SettingsResponse = {
  data: GpsTableSettingData | undefined;
};

const userId =
  faker.person.firstName().toLowerCase() +
  '_' +
  faker.person.lastName().toLowerCase();

describe(`With userId:${userId}`, () => {
  describe(`GET - /v1/settings/:userId (get settings)`, () => {
    beforeEach(async () => {
      await fetch(`${apiUrl}/v1/settings/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: faker.person.fullName(),
          name: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          profilePictureUrl: faker.image.url(),
          isEmailVerified: faker.datatype.boolean(),
        }),
      });
    });

    test('should return 200 and settings data when user exists', async () => {
      const response = await fetch(`${apiUrl}/v1/settings/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseBody = (await response.json()) as SettingsResponse;

      expect(response.status).toBe(200);
      expect(responseBody.data).toBeDefined();
    });

    test('should return 200 and undefined when user does not exist', async () => {
      const nonExistentUserId = faker.string.uuid();

      const response = await fetch(
        `${apiUrl}/v1/settings/${nonExistentUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const responseBody = (await response.json()) as SettingsResponse;

      expect(response.status).toBe(200);
      expect(responseBody.data).toBeUndefined();
    });
  });
});
