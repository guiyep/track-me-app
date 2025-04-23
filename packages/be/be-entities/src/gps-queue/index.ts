import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { marshallSqsAttributes } from '@track-me-app/aws';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';

const Consts = getConstants();
const sqsClient = new SQSClient();

export const sendQueueMessage = logger.func(
  async ({ userId, sessionId }: { userId: string; sessionId: string }) => {
    const attributes = marshallSqsAttributes({
      userId,
      sessionId,
    });

    const command = new SendMessageCommand({
      QueueUrl: Consts.GpsLocationsQueue.QUEUE_URL,
      MessageBody: Consts.GpsLocationsQueue.GPS_LOCATION_ADDED_COMMAND,
      MessageAttributes: attributes,
    });

    const data = await sqsClient.send(command);

    logger.log({ message: 'Message sent successfully:' }, data.MessageId);
  },
);
