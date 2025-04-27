import { Router } from 'express';
import { GpsSession } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  userIdValidation,
} from '@track-me-app/express';
import { InvalidOperation } from '@track-me-app/errors';
import type { GpsTableLatestSessionData } from '@track-me-app/gps-table/src/types';

const router = Router();

type GetSessionParams = {
  userId: string;
};

router.post(
  '/gps/end-session/:userId',
  validateParams(userIdValidation),
  expressHandler<
    GetSessionParams,
    GpsTableLatestSessionData | undefined,
    GpsTableLatestSessionData
  >(async ({ userId }) => {
    const item = await GpsSession.get({
      userId,
    });

    const sessionId = item?.data.sessionId;
    if (!sessionId) {
      throw new InvalidOperation({ message: 'sessionId not started' });
    }

    await GpsSession.save({
      userId,
      sessionId: undefined,
    });

    return {
      userId,
      sessionId: undefined,
    };
  }),
);

export default router;
