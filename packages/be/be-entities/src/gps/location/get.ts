import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import { GpsLocation } from '@track-me-app/be-entities';

const Consts = getConstants();

const loggerA = logger.decorate({
  name: 'get',
  folder: 'gps/location',
});

export const get = loggerA.asyncFunc(
  async ({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }): Promise<GpsLocation.Entity | undefined> => {
    const client = new DynamoDBClient();

    const data = await client.send(
      new GetItemCommand({
        TableName: Consts.GpsTable.TABLE_NAME,
        Key: {
          partitionKey: marshall(userId),
          sortKey: marshall(sessionId),
        },
      }),
    );

    if (data.Item) {
      const item = GpsLocation.Entity.fromRecord(data.Item);
      return item;
    }

    return undefined;
  },
);
