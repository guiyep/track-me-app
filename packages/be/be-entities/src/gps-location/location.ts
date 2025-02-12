import { GpsLocationEntity } from '@track-me-app/entities';
import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import * as z from 'zod';

const Consts = getConstants();

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

export const save = logger.func(
  async (entity: GpsLocationEntity): Promise<GpsLocationEntity> => {
    const client = new DynamoDBClient();

    entity.setLastUpdated();

    const params = {
      TableName: Consts.GpsTable.TABLE_NAME,
      Item: marshall(entity, { convertClassInstanceToMap: true }),
    };

    const command = new PutItemCommand(params);
    await client.send(command);

    return entity;
  },
);
