import { Router } from 'express';
import { GpsLocation } from '@track-me-app/be-entities';
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
  data: GpsLocation.Entity;
};

const saveOne = async (args: GpsTableInfo): Promise<GpsTableData> => {
  const gpsLocationEntity = new GpsLocation.Entity(args);
  const result = await GpsLocation.save(gpsLocationEntity);
  return result.data;
};

router.post(
  '/gps/add-locations/:userId/:sessionId',
  validateItems(GpsLocation.validate, { min: 1, max: 1000 }),
  expressHandler<
    GpsTableIdentifiers,
    object,
    ListBody<GpsTableLocation & GpsTableIdentifiers>
  >(async ({ userId, sessionId }, { items }) => {
    const result: GpsTableData[] = await processBatch(
      items,
      (one: GpsTableLocation) => saveOne({ userId, sessionId, ...one }),
      100,
    );

    return result;
  }),
);

export const addLocationsRoute = router;
