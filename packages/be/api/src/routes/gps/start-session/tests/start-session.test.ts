import { App } from 'supertest/types';
import app from '../../../../app/index';
import * as request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockUuidv4 = uuidv4 as jest.Mock;

const Consts = getConstants();

describe('POST /gps-start-session/:email/ (start session) ', () => {
  test('to return 400 when session already started', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(GetItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({
        Item: marshall({ sessionId: 'a session', email: 'an email' }),
      });

    const response: request.Response = await request(app as App)
      .post('/gps-start-session/guiyep@gmail.com')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(400);
  });

  test('to return 200 when session has not started', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(GetItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({
        Item: undefined,
      });

    dynamoMockClient
      .on(PutItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({});

    const newSessionId = '1234-5678-91011';
    mockUuidv4.mockReturnValue(newSessionId);

    const response = await request(app as App)
      .post('/gps-start-session/guiyep@gmail.com')
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: newSessionId });
  });
});
