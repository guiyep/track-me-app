import { Router } from 'express';
import addLocationRoute from './add-location/index';
import startSessionRoute from './start-session/index';
import endSessionRoute from './end-session/index';

const defaultRouter = Router();

defaultRouter.get('/gps-test', function (_, res) {
  res.json({ message: 'Hello gps-test' });
});

export default [
  defaultRouter,
  addLocationRoute,
  startSessionRoute,
  endSessionRoute,
];
