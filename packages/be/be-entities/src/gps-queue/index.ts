import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { marshallSqsAttributes } from '@track-me-app/aws';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';

const Consts = getConstants();

export const sendQueueMessage = async ({
  email,
  sessionId,
}: {
  email: string;
  sessionId: string;
}) => {
  const sqsClient = new SQSClient();

  const attributes = marshallSqsAttributes({
    email,
    sessionId,
  });

  const command = new SendMessageCommand({
    QueueUrl: Consts.GpsLocationsQueue.QUEUE_URL,
    MessageBody: Consts.GpsLocationsQueue.GPS_LOCATION_ADDED_COMMAND,
    MessageAttributes: attributes,
  });

  logger.log({ message: 'Sqs attributes' }, attributes);
  logger.log({ message: 'Command for sqs build' }, command);

  const data = await sqsClient.send(command);

  logger.log({ message: 'Message sent successfully:' }, data.MessageId);
};
