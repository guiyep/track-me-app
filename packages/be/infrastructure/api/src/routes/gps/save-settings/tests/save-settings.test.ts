import type { App } from 'supertest/types';
import app from '../../../../app/index';
import request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { faker } from '@faker-js/faker';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const Consts = getConstants();

describe('POST /v1/settings/:userId', () => {
  test('to return 400 when validation do not pass', async () => {
    const response = await request(app as App)
      .post(`/v1/settings/${faker.internet.username()}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        profilePictureUrl: faker.image.url(),
        isEmailVerified: faker.datatype.boolean(),
      });

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(400);
  });

  test('to return 200', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);

    dynamoMockClient
      .on(PutItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({});

    const snsMockClient = mockClient(SNSClient);
    snsMockClient.on(PublishCommand).resolves({});

    const response = await request(app as App)
      .post(`/v1/settings/${faker.internet.username()}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        displayName: faker.person.fullName(),
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        profilePictureUrl: faker.image.url(),
        isEmailVerified: faker.datatype.boolean(),
      });

    expect(response.status).toEqual(200);
  });
});
