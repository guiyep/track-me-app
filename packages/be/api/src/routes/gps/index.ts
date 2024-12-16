import { Router, Request, Response, NextFunction } from 'express';
import { GpsLocation } from '@track-me-app/be-entities';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction) => {
  try {
    GpsLocation.validate(req.body);
    next();
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

router.post('/gps-post', validate, (req: Request, res: Response) => {
  try {
    res.json({ message: 'Hello gps post' });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.get('/gps', function (_, res) {
  res.json({ message: 'Hello gps get' });
});

export default router;
