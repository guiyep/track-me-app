import { Router } from 'express';

const router = Router();

router.get('/report', function (_, res) {
  res.json({ message: 'Hello report' });
});

export default router;
