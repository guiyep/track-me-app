import { Router, Request, Response } from 'express';
import { GpsLocation } from '@track-me-app/be-entities';
import { GpsLocationEntity } from '@track-me-app/entities';
import { validate } from '@track-me-app/express';
import { logger } from '@track-me-app/logger';

const router = Router();

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
  validate(GpsLocation.validate),
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
