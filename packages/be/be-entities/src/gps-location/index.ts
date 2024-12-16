import { GpsLocationEntity } from '@track-me-app/entities';
import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { logger } from '@track-me-app/logger';
import * as z from 'zod';

const tableName = 'GpsLocations';

export const validate = (data: unknown): void => {
  const schema = z.object({
    email: z.string().email(),
    displayName: z.string().min(1),
    sessionId: z.string().min(1),
    lat: z.number().refine((val) => val >= -90 && val <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
    long: z.number().refine((val) => val >= -180 && val <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
  });

  schema.parse(data);
};

export const save = async (
  entity: GpsLocationEntity,
): Promise<GpsLocationEntity> => {
  const client = new DynamoDBClient();

  entity.setLastUpdated();

  logger.log({ message: 'Saving GpsLocation with entity' }, entity);

  const params = {
    TableName: tableName,
    Item: marshall(entity, { convertClassInstanceToMap: true }),
  };

  const command = new PutItemCommand(params);

  logger.log(
    { message: 'Saving GpsLocation with PutItemCommand using params' },
    command,
  );

  await client.send(command);

  logger.log({ message: 'PutItemCommand executed successfully' });

  return entity;
};
