import { Request, Response, NextFunction } from 'express';
import { logger } from '@track-me-app/logger';

export const validateAll =
  (f: (data: unknown) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.log({ message: 'Request params' }, req.params);
      logger.log({ message: 'Request body' }, req.body);
      f({ ...req.params, ...req.body });
      next();
    } catch (e) {
      res.status(400).json({ message: e });
    }
  };

export const validateParams =
  (f: (data: unknown) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.log({ message: 'Request params' }, req.params);
      f({ ...req.params });
      next();
    } catch (e) {
      res.status(400).json({ message: e });
    }
  };

export const validateBody =
  (f: (data: unknown) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.log({ message: 'Request body' }, req.body);
      f({ ...req.body });
      next();
    } catch (e) {
      res.status(400).json({ message: e });
    }
  };
