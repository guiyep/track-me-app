import { App } from 'supertest/types';
import app from '../../../../app/index';
import request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import type { GpsLocationPostResponseBody } from '../index';
import { getConstants } from '@track-me-app/be-consts';
import {
  generateGpsInfo,
  generateWifiSignalInfo,
  generateBatteryInfo,
} from '@track-me-app/testing';

const Consts = getConstants();

describe('POST /v1/gps/add-location/:userId/:sessionId (add location) ', () => {
  test('to return 400 on empty body', async () => {
    const response: request.Response = await request(app as App)
      .post('/v1/gps/add-location/guiyep/222gh')
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(400);
  });

  test('to return 400 when validation do not pass', async () => {
    const response: request.Response = await request(app as App)
      .post('/v1/gps/add-location/guiyep/222gh')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ displayName: 222 });

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(400);
  });

  test('to return 200 when correctly called', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(PutItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({});

    const snsMockClient = mockClient(SQSClient);
    snsMockClient
      .on(SendMessageCommand, {
        QueueUrl: Consts.GpsLocationsQueue.QUEUE_URL,
        MessageBody: Consts.GpsLocationsQueue.GPS_LOCATION_ADDED_COMMAND,
      })
      .resolves({ MessageId: '222' });

    const response: request.Response = await request(app as App)
      .post('/v1/gps/add-location/guiyep/222gh')
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

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(body.data).toMatchSnapshot();
  });
});
