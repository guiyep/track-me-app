import { Router, Request, Response } from 'express';
import { logger } from '@track-me-app/logger';
// import { createId } from '@paralleldrive/cuid2';

const router = Router();

type StartSessionParams = {
  email: string;
};

router.post(
  '/gps/end-session/:email/',
  (req: Request<StartSessionParams, object, void>, res: Response) => {
    logger.log({ message: '/gps/start-session/:email/' }, req);
    res.json({ message: 'Hello /gps/end-session/:email/' });
  },
);

export default router;
