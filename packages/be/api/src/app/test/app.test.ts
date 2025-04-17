import { App } from 'supertest/types';
import app from '../index';
import request from 'supertest';
import type { VersionResponseBody } from '../index';

describe('GET /version', () => {
  test('to succeed', async () => {
    const response: request.Response = await request(app as App)
      .get('/version')
      .set('Accept', 'application/json');

    const body = response.body as VersionResponseBody;

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(body.message).toEqual('Api V1');
    expect(body.identifier).toEqual(1);
    expect(body.version).toEqual('v1');
    expect(body.versionList).toEqual(['v1']);
  });
});
