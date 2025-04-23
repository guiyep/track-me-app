import { Router } from 'express';
import { Settings } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  userIdValidation,
} from '@track-me-app/express';
import { GpsTableSettingData } from '@track-me-app/gps-table';

const router = Router();

type UserIdParams = {
  userId: string;
};

router.get(
  '/settings/:userId',
  validateParams(userIdValidation),
  expressHandler<UserIdParams, GpsTableSettingData | undefined>(
    async ({ userId }) => {
      const item = await Settings.get({
        userId,
      });

      return item?.data;
    },
  ),
);

export default router;
