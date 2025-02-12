import { Request, Response, NextFunction } from 'express';
import { logger } from '@track-me-app/logger';

export const validateAll =
  (f: (data: unknown) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.log({ message: 'validateAll: Request params' }, req.params);
      logger.log({ message: 'validateAll: Request body' }, req.body);
      f({ ...req.params, ...req.body });
      next();
    } catch (e) {
      logger.error({ message: 'validateAll: failed' }, e);
      res.status(400).json({ message: e });
    }
  };

export const validateParams =
  (f: (data: unknown) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.log({ message: 'validateParams: Request params' }, req.params);
      f({ ...req.params });
      next();
    } catch (e) {
      logger.error({ message: 'validateParams: failed' }, e);
      res.status(400).json({ message: e });
    }
  };

export const validateBody =
  (f: (data: unknown) => void) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.log({ message: 'validateBody: Request body' }, req.body);
      f({ ...req.body });
      next();
    } catch (e) {
      logger.error({ message: 'validateBody: failed' }, e);
      res.status(400).json({ message: e });
    }
  };
