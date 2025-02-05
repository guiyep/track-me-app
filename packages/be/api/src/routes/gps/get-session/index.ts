import { Router } from 'express';
import { GpsSession } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  emailValidation,
} from '@track-me-app/express';

const router = Router();

type GetSessionParams = {
  email: string;
};

router.get(
  '/gps/get-session/:email',
  validateParams(emailValidation),
  expressHandler<GetSessionParams, string | undefined>(async ({ email }) => {
    const item = await GpsSession.get({
      email,
    });

    return item?.data.sessionId;
  }),
);

export default router;
