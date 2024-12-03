import { Router } from 'express';

const router = Router();

router.get('/gps', function (_, res) {
  res.json({ message: 'Hello gps' });
});

export default router;
