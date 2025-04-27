import { Router } from 'express';
import { GpsSession } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  userIdValidation,
} from '@track-me-app/express';
import { InvalidOperation } from '@track-me-app/errors';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

type StartSessionParams = {
  userId: string;
};

router.post(
  '/gps/start-session/:userId/',
  validateParams(userIdValidation),
  expressHandler<StartSessionParams, string>(async ({ userId }) => {
    const item = await GpsSession.get({
      userId,
    });

    if (item?.data.sessionId != null) {
      throw new InvalidOperation({ message: 'session already started' });
    }

    const newSessionId = uuidv4();
    await GpsSession.save(
      new GpsSession.Entity({
        userId,
        sessionId: newSessionId,
      }),
    );

    return newSessionId;
  }),
);

export default router;
