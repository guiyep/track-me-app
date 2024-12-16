import { Router, Request, Response, NextFunction } from 'express';
import { GpsLocation } from '@track-me-app/be-entities';
import { GpsLocationEntity } from '@track-me-app/entities';
import { logger } from '@track-me-app/logger';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.log({ message: 'Request params' }, req.params);
    logger.log({ message: 'Request body' }, req.body);
    GpsLocation.validate({ ...req.params, ...req.body });
    next();
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

type GpsLocationParams = {
  email: string;
  sessionId: string;
};

type GpsLocationBody = {
  displayName: string;
  lat: number;
  long: number;
};

router.post(
  '/gps/:email/:sessionId',
  validate,
  async (
    req: Request<GpsLocationParams, object, GpsLocationBody>,
    res: Response,
  ) => {
    logger.log({ message: 'Processing /gps/:email/:sessionId call' }, req);
    try {
      const gpsLocationEntity = new GpsLocationEntity({
        ...req.params,
        ...req.body,
      });
      const result = await GpsLocation.save(gpsLocationEntity);
      res.json({ message: 'Gps location saved', data: result });
    } catch (e) {
      logger.error({ message: 'Error saving GpsLocation' }, e);
      res.status(500).json({ error: e });
    }
  },
);

router.get('/gps', function (_, res) {
  res.json({ message: 'Hello gps get' });
});

export default router;
