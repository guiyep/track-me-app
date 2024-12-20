import * as express from 'express';
import { json } from 'express';
import routes from '../routes';

const app = express();

app.use(json());

routes.forEach((route) => {
  app.use(route);
});

export type VersionResponseBody = {
  message: string;
  identifier: number;
};

app.get('/version', function (_, res) {
  res.json({ message: 'Api V1', identifier: 1 });
});

export default app;
