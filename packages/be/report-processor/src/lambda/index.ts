import type { SQSEvent } from 'aws-lambda'; // Import types from @types/aws-lambda
import { logger } from '@track-me-app/logger';
import { GpsLocation, ReportEntry } from '@track-me-app/be-entities';
import { processBatch } from '@track-me-app/express';
import { transform } from '../processor';

const BATCH_SIZE = 50;

export const handler = logger.asyncFunc(async (event: SQSEvent) => {
  await processBatch(
    event.Records.map((record) =>
      GpsLocation.Entity.fromSqs(record.messageAttributes),
    ),
    async (one: GpsLocation.Entity) => {
      const result = await transform(one);
      await ReportEntry.save(result);
    },
    BATCH_SIZE,
  );
});
