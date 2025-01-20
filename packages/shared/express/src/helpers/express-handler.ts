import { Request, Response } from 'express';
import { logger } from '@track-me-app/logger';
import { InvalidOperation } from '@track-me-app/errors';

export type ExpressHandlerResponse<T> = {
  data: T;
};

export const expressHandler =
  <Params, ReturnValue = void, Body = never>(
    f: (params: Params, body: Body) => Promise<ReturnValue>,
  ) =>
  async (
    req: Request<Params, ReturnValue, Body>,
    res: Response,
  ): Promise<void> => {
    logger.log(
      { message: `Handling '${req.url}'` },
      { params: req.params, body: req.body },
    );

    try {
      const result = await f(req.params, req.body);
      logger.log(
        { message: `Execution of '${req.url}' succeeded, returning 200` },
        { params: req.params, body: req.body },
      );
      res.status(200).json({ data: result });
    } catch (e) {
      if (e instanceof InvalidOperation) {
        logger.log(
          { message: `Operation not valid '${req.url}', returning 400` },
          { params: req.params, e },
        );
        res.status(400).send();
      } else {
        logger.log(
          { message: `Error in '${req.url}', returning 500` },
          { params: req.params, e },
        );
        res.status(500).json({ error: e });
      }
    }
  };
