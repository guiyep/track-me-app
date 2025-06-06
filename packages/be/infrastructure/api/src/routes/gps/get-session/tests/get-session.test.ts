import type { App } from 'supertest/types';
import app from '../../../../app/index';
import request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { faker } from '@faker-js/faker';

// Set a consistent seed for faker
faker.seed(12345);

const Consts = getConstants();

describe('GET /v1/gps/get-session/:userId/ (start session) ', () => {
  const fakeUsername = faker.internet.username();
  const fakeSessionId = faker.string.uuid();

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
      .get(`/v1/gps/get-session/${fakeUsername}`)
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
        Item: marshall({
          data: { sessionId: fakeSessionId, userId: fakeUsername },
        }),
      });

    const response = await request(app as App)
      .get(`/v1/gps/get-session/${fakeUsername}`)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      data: fakeSessionId,
    });
  });
});
