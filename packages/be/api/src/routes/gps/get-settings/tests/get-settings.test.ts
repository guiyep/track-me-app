import type { App } from 'supertest/types';
import app from '../../../../app/index';
import request from 'supertest';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import type { GpsTableSettingData } from '@track-me-app/gps-table';

const Consts = getConstants();

describe('GET /v1/settings/:userId', () => {
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
      .get('/v1/settings/guiyep')
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
          data: { displayName: 'a name' },
        }),
      });

    const response = await request(app as App)
      .get('/v1/settings/guiyep')
      .set('Accept', 'application/json');

    const body = response.body as { data: GpsTableSettingData };

    expect(response.status).toEqual(200);
    expect(body.data).toEqual({
      displayName: 'a name',
    });
  });
});
