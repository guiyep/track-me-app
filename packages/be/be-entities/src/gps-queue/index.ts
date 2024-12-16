import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { marshallSqsAttributes } from '@track-me-app/aws';
import { logger } from '@track-me-app/logger';

const QUEUE_URL =
  'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/GpsQueue';

const GPS_LOCATION_COMMAND = 'GPS_LOCATION_ADDED';

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
    QueueUrl: QUEUE_URL,
    MessageBody: GPS_LOCATION_COMMAND,
    MessageAttributes: attributes,
  });

  logger.log({ message: 'Sqs attributes' }, attributes);
  logger.log({ message: 'Command for sqs build' }, command);

  const data = await sqsClient.send(command);

  logger.log({ message: 'Message sent successfully:' }, data.MessageId);
};
