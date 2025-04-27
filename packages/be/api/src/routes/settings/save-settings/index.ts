import { Router } from 'express';
import { Settings } from '@track-me-app/be-entities';
import { expressHandler, validateAll } from '@track-me-app/express';
import type { GpsTableSettingData } from '@track-me-app/gps-table';

const router = Router();

type StartSessionParams = {
  userId: string;
};

router.post(
  '/settings/:userId',
  validateAll(Settings.validate),
  expressHandler<
    StartSessionParams,
    GpsTableSettingData,
    Omit<GpsTableSettingData, 'userId'>
  >(async ({ userId }, body) => {
    const entity = await Settings.save(
      new Settings.Entity({ userId, ...body }),
    );
    return entity.data;
  }),
);

export default router;
