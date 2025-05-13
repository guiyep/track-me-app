import type { GpsSettings } from '@track-me-app/be-entities';
import { logger } from '@track-me-app/logger';
import type { MessageHandler } from '../type';

export const settingsAddedHandler: MessageHandler<GpsSettings.Entity> =
  logger.asyncFunc(async (entity: GpsSettings.Entity): Promise<void> => {
    logger.log({ message: 'Report' }, entity);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // save report
  });
