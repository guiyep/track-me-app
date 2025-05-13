import { Router } from 'express';
import { GpsLocation } from '@track-me-app/be-entities';
import { validateAll, expressHandler } from '@track-me-app/express';
import type {
  GpsTableLocation,
  GpsTableIdentifiers,
} from '@track-me-app/gps-table';

const router = Router();

export type GpsLocationPostResponseBody = {
  data: GpsLocation.Entity;
};

router.post(
  '/gps/add-location/:userId/:sessionId',
  validateAll(GpsLocation.validate),
  expressHandler<GpsTableIdentifiers, object, GpsTableLocation>(
    async ({ userId, sessionId }, body) => {
      const gpsLocationEntity = new GpsLocation.Entity({
        userId,
        sessionId,
        ...body,
      });

      const result = await GpsLocation.save(gpsLocationEntity);

      return result.data;
    },
  ),
);

export const addLocationRoute = router;
