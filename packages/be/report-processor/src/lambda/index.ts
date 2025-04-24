import { SQSEvent } from 'aws-lambda'; // Import types from @types/aws-lambda
import { logger } from '@track-me-app/logger';
import { GpsLocation } from '@track-me-app/be-entities';

export const handler = logger.asyncFunc((event: SQSEvent) => {
  // Process each SQS message in the event
  for (const record of event.Records) {
    const entity = GpsLocation.Entity.fromSqs(record.messageAttributes);
    logger.log({ message: 'Processing record' }, entity.data);
  }

  // Return a success response
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Processed SQS message(s)',
    }),
  };
});
