import { Router } from 'express';
import { GpsLocation, GpsQueue } from '@track-me-app/be-entities';
import { GpsLocationEntity } from '@track-me-app/entities';
import {
  validateItems,
  expressHandler,
  type ListBody,
  processBatch,
} from '@track-me-app/express';
import type {
  GpsTableLocation,
  GpsTableIdentifiers,
  GpsTableInfo,
  GpsTableData,
} from '@track-me-app/gps-table';

const router = Router();

export type GpsLocationPostResponseBody = {
  data: GpsLocationEntity;
};

const saveOne = async (args: GpsTableInfo): Promise<GpsTableData> => {
  const { email, sessionId } = args;
  const gpsLocationEntity = new GpsLocationEntity(args);

  const result = await GpsLocation.save(gpsLocationEntity);
  await GpsQueue.sendQueueMessage({ email, sessionId });

  return result.data;
};

router.post(
  '/gps/add-locations/:email/:sessionId',
  validateItems(GpsLocation.validate, { min: 1, max: 1000 }),
  expressHandler<
    GpsTableIdentifiers,
    object,
    ListBody<GpsTableLocation & GpsTableIdentifiers>
  >(async ({ email, sessionId }, { items }) => {
    const result: GpsTableData[] = await processBatch(
      items,
      (one: GpsTableLocation) => saveOne({ email, sessionId, ...one }),
      100,
    );

    return result;
  }),
);

export default router;
