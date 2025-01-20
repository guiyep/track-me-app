import { Router } from 'express';
import { GpsSession } from '@track-me-app/be-entities';
import {
  expressHandler,
  validateParams,
  emailValidation,
} from '@track-me-app/express';
import { getConstants } from '@track-me-app/be-consts';
import { InvalidOperation } from '@track-me-app/errors';
import { v4 as uuidv4 } from 'uuid';

const Consts = getConstants();

const router = Router();

type StartSessionParams = {
  email: string;
};

router.post(
  '/gps-start-session/:email/',
  validateParams(emailValidation),
  expressHandler<StartSessionParams, string>(async ({ email }) => {
    const item = await GpsSession.get({
      email,
      sessionId: Consts.GpsTable.LATEST_SESSION_KEY,
    });

    if (item?.data.sessionId != null) {
      throw new InvalidOperation({ message: 'session already started' });
    }

    const newSessionId = uuidv4();
    await GpsSession.save({ sessionId: newSessionId, email });

    return newSessionId;
  }),
);

export default router;
