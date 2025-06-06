import type { App } from 'supertest/types';
import app from '../../../../app/index';
import request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

// Set a consistent seed for faker
faker.seed(12345);

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockUuidv4 = uuidv4 as jest.Mock;

const Consts = getConstants();

describe('POST /v1/gps/start-session/:userId/ (start session) ', () => {
  const fakeUsername = faker.internet.username();
  const fakeSessionId = faker.string.uuid();

  test('to return 400 when session already started', async () => {
    const dynamoMockClient = mockClient(DynamoDBClient);
    dynamoMockClient
      .on(GetItemCommand, {
        TableName: Consts.GpsTable.TABLE_NAME,
      })
      .resolves({
        Item: marshall({
          data: { sessionId: fakeSessionId, userId: fakeUsername },
        }),
      });

    const response: request.Response = await request(app as App)
      .post(`/v1/gps/start-session/${fakeUsername}`)
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

    const newSessionId = fakeSessionId;
    mockUuidv4.mockReturnValue(newSessionId);

    const response = await request(app as App)
      .post(`/v1/gps/start-session/${fakeUsername}`)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: newSessionId });
  });
});
