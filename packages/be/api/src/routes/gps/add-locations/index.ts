import { Router } from 'express';
import { GpsLocation, GpsQueue } from '@track-me-app/be-entities';
import { GpsLocationEntity } from '@track-me-app/entities';
import {
  validateItems,
  expressHandler,
  type ListBody,
  processBatch,
} from '@track-me-app/express';

const router = Router();

type GpsLocationParams = {
  email: string;
  sessionId: string;
};

type GpsLocation = {
  displayName: string;
  lat: number;
  long: number;
};

export type GpsLocationPostResponseBody = {
  data: GpsLocationEntity;
};

const saveOne = async ({
  email,
  sessionId,
  displayName,
  lat,
  long,
}: {
  email: string;
  sessionId: string;
  displayName: string;
  lat: number;
  long: number;
}): Promise<GpsLocationEntity> => {
  const gpsLocationEntity = new GpsLocationEntity({
    email,
    sessionId,
    displayName,
    lat,
    long,
  });

  const result = await GpsLocation.save(gpsLocationEntity);
  await GpsQueue.sendQueueMessage({ email, sessionId });

  return result;
};

router.post(
  '/gps/add-locations/:email/:sessionId',
  validateItems(GpsLocation.validate, { min: 1, max: 1000 }),
  expressHandler<GpsLocationParams, object, ListBody<GpsLocation>>(
    async ({ email, sessionId }, { items }) => {
      const result: GpsLocationEntity[] = await processBatch(
        items,
        (one: GpsLocation) => saveOne({ email, sessionId, ...one }),
        100,
      );

      return result;
    },
  ),
);

export default router;
