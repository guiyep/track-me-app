import { Router } from 'express';
import { GpsSession } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  emailValidation,
} from '@track-me-app/express';
import { SessionData } from '@track-me-app/entities';

const router = Router();

type GetSessionParams = {
  email: string;
};

router.get(
  '/gps/get-session/:email',
  validateParams(emailValidation),
  expressHandler<GetSessionParams, SessionData | undefined>(
    async ({ email }) => {
      const item = await GpsSession.get({
        email,
      });

      return item?.data;
    },
  ),
);

export default router;
