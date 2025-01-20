import { App } from 'supertest/types';
import app from '../../../../app/index';
import * as request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';

const Consts = getConstants();

describe('GET /get-session/:email/ (start session) ', () => {
  test('to return 200 with undefined if not present', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(GetItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({
        Item: undefined,
      });

    const response: request.Response = await request(app as App)
      .get('/gps-session/guiyep@gmail.com')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: undefined });
  });

  test('to return 200 when present with the data', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(GetItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({
        Item: marshall({ sessionId: 'a session', email: 'an email' }),
      });

    const response = await request(app as App)
      .get('/gps-session/guiyep@gmail.com')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      data: { sessionId: 'a session', email: 'an email' },
    });
  });
});
