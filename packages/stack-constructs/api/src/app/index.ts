import express from 'express';
import routes from '../routes';

const app = express();

routes.forEach((route) => {
  app.use(route);
});

app.get('/', function (_, res) {
  res.json({ message: 'Hello World test 2' });
});

export default app;
