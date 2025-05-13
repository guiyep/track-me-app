import { Router } from 'express';
import { GpsSettings } from '@track-me-app/be-entities';
import { expressHandler, validateAll } from '@track-me-app/express';
import type { GpsTableSettingData } from '@track-me-app/gps-table';

const router = Router();

type StartSessionParams = {
  userId: string;
};

router.post(
  '/settings/:userId',
  validateAll(GpsSettings.validate),
  expressHandler<
    StartSessionParams,
    GpsTableSettingData,
    Omit<GpsTableSettingData, 'userId'>
  >(async ({ userId }, body) => {
    const entity = await GpsSettings.save(
      new GpsSettings.Entity({ userId, ...body }),
    );
    return entity.data;
  }),
);

export default router;
