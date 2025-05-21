import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { GpsLocation } from '@track-me-app/be-entities';
import { sendLocationAddedNotification } from '../notifications';

const Consts = getConstants();

const loggerA = logger.decorate({
  name: 'save',
  folder: 'gps/location',
});

export const save = loggerA.asyncFunc(
  async (entity: GpsLocation.Entity): Promise<GpsLocation.Entity> => {
    const client = new DynamoDBClient();

    entity.setLastUpdated();

    const params = {
      TableName: Consts.GpsTable.TABLE_NAME,
      Item: marshall(entity, { convertClassInstanceToMap: true }),
    };

    const command = new PutItemCommand(params);
    await client.send(command);

    await sendLocationAddedNotification({ entity });

    return entity;
  },
);
