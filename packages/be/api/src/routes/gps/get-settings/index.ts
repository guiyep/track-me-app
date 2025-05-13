import { Router } from 'express';
import { GpsSettings } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  userIdValidation,
} from '@track-me-app/express';
import type { GpsTableSettingData } from '@track-me-app/gps-table';

const router = Router();

type UserIdParams = {
  userId: string;
};

router.get(
  '/settings/:userId',
  validateParams(userIdValidation),
  expressHandler<UserIdParams, GpsTableSettingData | undefined>(
    async ({ userId }) => {
      const item = await GpsSettings.get({
        userId,
      });

      return item?.data;
    },
  ),
);

export default router;
