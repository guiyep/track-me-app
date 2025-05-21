import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import { Entity } from './entity';

const Consts = getConstants();

const loggerA = logger.decorate({
  name: 'get',
  folder: 'gps/settings',
});

export const get = loggerA.asyncFunc(
  async ({ userId }: { userId: string }): Promise<Entity | undefined> => {
    const client = new DynamoDBClient();

    const data = await client.send(
      new GetItemCommand({
        TableName: Consts.GpsTable.TABLE_NAME,
        Key: {
          partitionKey: marshall(userId),
          sortKey: marshall(Consts.GpsTable.SETTING_KEY),
        },
      }),
    );

    if (data.Item) {
      const item = Entity.fromRecord(data.Item);
      return item;
    }

    return undefined;
  },
);
