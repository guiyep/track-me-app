import { Router } from 'express';
import { GpsSession } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  emailValidation,
} from '@track-me-app/express';
import { SessionData } from '@track-me-app/entities';
import { InvalidOperation } from '@track-me-app/errors';

const router = Router();

type GetSessionParams = {
  email: string;
};

router.post(
  '/gps/end-session/:email',
  validateParams(emailValidation),
  expressHandler<GetSessionParams, SessionData | undefined, SessionData>(
    async ({ email }) => {
      const item = await GpsSession.get({
        email,
      });

      const sessionId = item?.data.sessionId;
      if (!sessionId) {
        throw new InvalidOperation({ message: 'sessionId not started' });
      }

      await GpsSession.save({
        email,
        sessionId: undefined,
      });

      return {
        email,
        sessionId: undefined,
      };
    },
  ),
);

export default router;
