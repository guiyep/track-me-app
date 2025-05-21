import type { SQSEvent } from 'aws-lambda'; // Import types from @types/aws-lambda
import { logger } from '@track-me-app/logger';
import { processBatch } from '@track-me-app/express';
import { getSnsInfoFromLambdaRecord } from '@track-me-app/aws';
import { getConstants } from '@track-me-app/be-consts';
import { messagesHandler } from '../messages';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Consts = getConstants();

const BATCH_SIZE = 50;

export type MessageType =
  (typeof Consts.GpsSns.MESSAGES)[keyof typeof Consts.GpsSns.MESSAGES];

const loggerA = logger.decorate({
  name: 'handler',
  folder: 'lambda',
});

export const handler = loggerA.asyncFunc(async (event: SQSEvent) => {
  await processBatch(
    event.Records.map((record) => ({
      ...getSnsInfoFromLambdaRecord<MessageType>(record),
    })),
    ({ type, dataJson }) => messagesHandler({ type, dataJson }),
    BATCH_SIZE,
  );
});
