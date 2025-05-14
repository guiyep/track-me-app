import type { GpsSettings } from '@track-me-app/be-entities';
import { logger } from '@track-me-app/logger';
import type { MessageHandler } from '../type';
import { ReportEntry } from '@track-me-app/be-entities';
import { processBatch } from '@track-me-app/express';

const BATCH_SIZE = 50;

export const settingsAddedHandler: MessageHandler<GpsSettings.Entity> =
  logger.asyncFunc(async (settings: GpsSettings.Entity): Promise<void> => {
    const userInfo = settings.data;
    const entries = await ReportEntry.getByUserId(settings.data.userId);
    await processBatch(
      entries,
      (entry) =>
        ReportEntry.save(
          new ReportEntry.Entity({
            ...entry.data,
            userInfo,
          }),
        ),
      BATCH_SIZE,
    );
  });
