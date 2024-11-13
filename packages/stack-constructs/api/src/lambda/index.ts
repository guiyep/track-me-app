import { APIGatewayProxyHandler } from 'aws-lambda';
import { logger } from '@track-me-app/shared';

export const handler: APIGatewayProxyHandler = async (event) => {
  logger.warn({ message: 'Request event' }, event);
  // for testing
  await new Promise((resolve) => {
    resolve(222);
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda new!!!',
    }),
  };
};
