import { Router } from 'express';
import { GpsLocation, GpsQueue } from '@track-me-app/be-entities';
import { GpsLocationEntity } from '@track-me-app/entities';
import { validateAll, expressHandler } from '@track-me-app/express';

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

export type GpsLocationPostResponseBody = {
  data: GpsLocationEntity;
};

router.post(
  '/gps/add-location/:email/:sessionId',
  validateAll(GpsLocation.validate),
  expressHandler<GpsLocationParams, object, GpsLocationBody>(
    async ({ email, sessionId }, body) => {
      const gpsLocationEntity = new GpsLocationEntity({
        email,
        sessionId,
        ...body,
      });

      const result = await GpsLocation.save(gpsLocationEntity);
      await GpsQueue.sendQueueMessage({ email, sessionId });

      return result;
    },
  ),
);

export default router;
