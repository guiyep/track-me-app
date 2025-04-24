import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { marshallSqsAttributes } from '@track-me-app/aws';
import { getConstants } from '@track-me-app/be-consts';
import { GpsLocationEntity } from '@track-me-app/entities';
import { logger } from '@track-me-app/logger';

const Consts = getConstants();
const sqsClient = new SQSClient();

export type SqsAttributesMessage = {
  userId: string;
  sessionId: string;
  data: string;
};

export const sendQueueMessage = logger.asyncFunc(
  async (item: GpsLocationEntity) => {
    const attributes = marshallSqsAttributes({
      userId: item.data.userId,
      sessionId: item.data.sessionId,
      data: JSON.stringify(item.data),
    });

    logger.log({ message: 'Sending message to queue' }, attributes);

    const command = new SendMessageCommand({
      QueueUrl: Consts.GpsLocationsQueue.QUEUE_URL,
      MessageBody: Consts.GpsLocationsQueue.GPS_LOCATION_ADDED_COMMAND,
      MessageAttributes: attributes,
    });

    const data = await sqsClient.send(command);

    logger.log({ message: 'Message sent successfully:' }, data.MessageId);
  },
);
