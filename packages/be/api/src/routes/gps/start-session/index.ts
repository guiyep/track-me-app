import { Router, Request, Response } from 'express';
import { logger } from '@track-me-app/logger';
// import { createId } from '@paralleldrive/cuid2';

const router = Router();

type StartSessionParams = {
  email: string;
};

router.post(
  '/gps/start-session/:email/',
  (req: Request<StartSessionParams, object, void>, res: Response) => {
    logger.log({ message: '/gps/start-session/:email/' }, req);
    try {
      //   const { email } = req.params;

      res.json({ message: 'Gps location saved', data: {} });
    } catch (e) {
      logger.error({ message: 'Error saving GpsLocation' }, e);
      res.status(500).json({ error: e });
    }
  },
);

export default router;
