import type { Request, Response, NextFunction } from 'express';
import { logger } from '@track-me-app/logger';
import type { ListBody } from '../index';

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

export const validateItems =
  (f: (data: unknown) => void, { max, min }: { max: number; min: number }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.log({ message: 'validateAll: Request params' }, req.params);
      logger.log({ message: 'validateAll: Request body' }, req.body);

      const { items } = req.body as ListBody<object>;

      logger.log({ message: 'validateAll: Request items transformed' }, items);

      if (items.length >= max) {
        throw new Error(`you cannot send more than ${max.toString()} elements`);
      }
      if (items.length <= min) {
        throw new Error(`you cannot send less than ${min.toString()} elements`);
      }

      if (items.length)
        items.forEach((item) => {
          f({ ...req.params, ...item });
        });

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
