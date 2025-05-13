import express, { json, Router } from 'express';
import routes from '../routes';

const app = express();

app.use(json());

// Create a versioned router for v1
const v1Router = Router();

// Mount all routes under /v1
routes.forEach((route) => {
  v1Router.use(route);
});

export type VersionResponseBody = {
  message: string;
  identifier: number;
  version: string;
  versionList: string[];
};

// Add version endpoint under v1
app.get('/version', function (_, res) {
  res.json({
    message: 'Api V1',
    version: 'v1',
    identifier: 1,
    versionList: ['v1'],
  });
});

// Mount the v1 router at /v1
app.use('/v1', v1Router);

export default app;
