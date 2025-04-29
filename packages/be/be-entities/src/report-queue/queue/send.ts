import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { marshallSqsAttributes } from '@track-me-app/aws';
import { getConstants } from '@track-me-app/be-consts';
import type { GpsLocation } from '@track-me-app/be-entities';
import { logger } from '@track-me-app/logger';

const Consts = getConstants();
const sqsClient = new SQSClient();

export const sendQueueMessage = logger.asyncFunc(
  async (item: GpsLocation.Entity) => {
    const attributes = marshallSqsAttributes({
      userId: item.data.userId,
      sessionId: item.data.sessionId,
      data: JSON.stringify(item.data),
    });

    const command = new SendMessageCommand({
      QueueUrl: Consts.ReportQueue.QUEUE_URL,
      MessageBody: Consts.ReportQueue.GPS_LOCATION_ADDED_COMMAND,
      MessageAttributes: attributes,
    });

    await sqsClient.send(command);
  },
);
