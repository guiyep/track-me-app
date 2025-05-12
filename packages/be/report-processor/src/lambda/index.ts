import type { SNSEvent } from 'aws-lambda'; // Import types from @types/aws-lambda
import { logger } from '@track-me-app/logger';
import { processBatch } from '@track-me-app/express';
import { getSnsTypeFromLambdaRecord } from '@track-me-app/aws';
import { getConstants } from '@track-me-app/be-consts';
import { messagesHandler } from '../messages';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Consts = getConstants();

const BATCH_SIZE = 50;

export type MessageType =
  (typeof Consts.GpsSns.MESSAGES)[keyof typeof Consts.GpsSns.MESSAGES];

export const handler = logger.asyncFunc(async (event: SNSEvent) => {
  await processBatch(
    event.Records.map((record) => ({
      type: getSnsTypeFromLambdaRecord<MessageType>(record),
      dataJson: record.Sns.Message,
    })),
    ({ type, dataJson }) => messagesHandler({ type, dataJson }),
    BATCH_SIZE,
  );
});
