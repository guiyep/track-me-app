import { SessionData, SessionEntity } from '@track-me-app/entities';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import * as z from 'zod';
import { logger } from '@track-me-app/logger';

const Consts = getConstants();

export const validate = (data: unknown): void => {
  const schema = z.object({
    userId: z.string(),
    sessionId: z.string().min(1),
  });

  schema.parse(data);
};

export const save = logger.asyncFunc(
  async ({ sessionId, userId }: SessionData): Promise<SessionData> => {
    const client = new DynamoDBClient();
    await client.send(
      new PutItemCommand({
        TableName: Consts.GpsTable.TABLE_NAME,
        Item: marshall(new SessionEntity({ sessionId, userId }), {
          convertClassInstanceToMap: true,
        }),
      }),
    );

    return { sessionId, userId };
  },
);

export const get = logger.asyncFunc(
  async ({
    userId,
  }: {
    userId: string;
  }): Promise<SessionEntity | undefined> => {
    const client = new DynamoDBClient();

    const data = await client.send(
      new GetItemCommand({
        TableName: Consts.GpsTable.TABLE_NAME,
        Key: {
          partitionKey: marshall(userId),
          sortKey: marshall(Consts.GpsTable.LATEST_SESSION_KEY),
        },
      }),
    );

    if (data.Item) {
      const item = SessionEntity.fromRecord(data.Item);
      return item;
    }

    return undefined;
  },
);
