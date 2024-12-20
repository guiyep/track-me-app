import { App } from 'supertest/types';
import app from '../index';
import * as request from 'supertest';
import type { VersionResponseBody } from '../index';

describe('POST /gps/:email/:sessionId (add location) ', () => {
  test('to succeed', async () => {
    const response: request.Response = await request(app as App)
      .get('/version')
      .set('Accept', 'application/json');

    const body = response.body as VersionResponseBody;

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(body.message).toEqual('Api V1');
    expect(body.identifier).toEqual(1);
  });
});
