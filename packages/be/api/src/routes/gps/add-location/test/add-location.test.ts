import type { App } from 'supertest/types';
import app from '../../../../app/index';
import request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import type { GpsLocationPostResponseBody } from '../index';
import {
  generateGpsInfo,
  generateWifiSignalInfo,
  generateBatteryInfo,
} from '@track-me-app/testing';
import { faker } from '@faker-js/faker';

// Set a consistent seed for faker
faker.seed(12345);

describe('POST /v1/gps/add-location/:userId/:sessionId (add location) ', () => {
  const fakeUsername = faker.internet.username();
  const fakeSessionId = faker.string.uuid();

  test('to return 400 on empty body', async () => {
    const response: request.Response = await request(app as App)
      .post(`/v1/gps/add-location/${fakeUsername}/${fakeSessionId}`)
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(400);
  });

  test('to return 400 when validation do not pass', async () => {
    const response: request.Response = await request(app as App)
      .post(`/v1/gps/add-location/${fakeUsername}/${fakeSessionId}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ displayName: 222 });

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(400);
  });

  test('to return 200 when correctly called', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient.on(PutItemCommand).resolves({});

    const snsMockClient = mockClient(SNSClient);
    snsMockClient.on(PublishCommand).resolves({});

    const response: request.Response = await request(app as App)
      .post(`/v1/gps/add-location/${fakeUsername}/${fakeSessionId}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        lat: 2,
        long: 2,
        gpsInfo: generateGpsInfo(1),
        signalInfo: generateWifiSignalInfo(1),
        batteryInfo: generateBatteryInfo(1),
      });

    const body = response.body as GpsLocationPostResponseBody;

    expect(snsMockClient.calls()).toHaveLength(1);
    expect(dynamoMockClient.calls()).toHaveLength(1);

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(body.data).toMatchSnapshot();
  });
});
