import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { Entity } from './entity';

const Consts = getConstants();

const loggerA = logger.decorate({
  name: 'save',
  folder: 'gps/session',
});

export const save = loggerA.asyncFunc(
  async (entity: Entity): Promise<Entity> => {
    const client = new DynamoDBClient();
    await client.send(
      new PutItemCommand({
        TableName: Consts.GpsTable.TABLE_NAME,
        Item: marshall(entity, {
          convertClassInstanceToMap: true,
        }),
      }),
    );

    return entity;
  },
);
