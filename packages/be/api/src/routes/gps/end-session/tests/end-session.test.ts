import { App } from 'supertest/types';
import app from '../../../../app/index';
import request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';

const Consts = getConstants();

describe('GET /v1/gps/end-session/:email/', () => {
  test('to return 400 when session is not started', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(GetItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({
        Item: undefined,
      });

    const response: request.Response = await request(app as App)
      .post('/v1/gps/end-session/guiyep@gmail.com')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
  });

  test('to return 200 when we have a session and remove it', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(GetItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({
        Item: marshall({
          data: { sessionId: 'a-session', email: 'guiyep@gmail.com' },
        }),
      });

    dynamoMockClient
      .on(PutItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({});

    const response = await request(app as App)
      .post('/v1/gps/end-session/guiyep@gmail.com')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      data: { sessionId: undefined, email: 'guiyep@gmail.com' },
    });
  });
});
