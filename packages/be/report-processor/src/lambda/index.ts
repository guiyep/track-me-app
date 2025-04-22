import { SQSEvent } from 'aws-lambda'; // Import types from @types/aws-lambda
import { logger } from '@track-me-app/logger';

export const handler = logger.func((event: SQSEvent) => {
  logger.log({ message: 'Received event' }, event);

  // Process each SQS message in the event
  for (const record of event.Records) {
    logger.log({ message: 'Processing record' }, record);
  }

  // Return a success response
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Processed SQS message(s)',
    }),
  };
});
