import { Router } from 'express';
import { GpsSession } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  userIdValidation,
} from '@track-me-app/express';

const router = Router();

type GetSessionParams = {
  userId: string;
};

router.get(
  '/gps/get-session/:userId',
  validateParams(userIdValidation),
  expressHandler<GetSessionParams, string | undefined>(async ({ userId }) => {
    const item = await GpsSession.get({
      userId,
    });

    return item?.data.sessionId;
  }),
);

export default router;
