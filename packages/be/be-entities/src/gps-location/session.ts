import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import * as z from 'zod';
import { logger } from '@track-me-app/logger';
import type { GpsTableLatestSessionData } from '@track-me-app/gps-table';

const Consts = getConstants();

export class Entity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: GpsTableLatestSessionData;

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    logger.log({ message: 'Entity -> fromRecord' }, { dynamoData });
    const sessionEntity = unmarshall(dynamoData) as Entity;
    logger.log({ message: 'Entity -> unmarshall' }, sessionEntity);
    return new Entity(sessionEntity.data);
  }

  constructor({ sessionId, userId }: GpsTableLatestSessionData) {
    logger.log({ message: 'new Entity' }, { sessionId, userId });
    this.partitionKey = userId;
    // the session data will always have sorting key as LATEST_SESSION_KEY
    this.sortKey = Consts.GpsTable.LATEST_SESSION_KEY;
    this.data = {
      userId,
      // the session will change only based on the session that is running
      ...(sessionId ? { sessionId } : {}),
    };
  }
}

export const validate = (data: unknown): void => {
  const schema = z.object({
    userId: z.string(),
    sessionId: z.string().min(1),
  });

  schema.parse(data);
};

export const save = logger.asyncFunc(
  async ({
    sessionId,
    userId,
  }: GpsTableLatestSessionData): Promise<GpsTableLatestSessionData> => {
    const client = new DynamoDBClient();
    await client.send(
      new PutItemCommand({
        TableName: Consts.GpsTable.TABLE_NAME,
        Item: marshall(new Entity({ sessionId, userId }), {
          convertClassInstanceToMap: true,
        }),
      }),
    );

    return { sessionId, userId };
  },
);

export const get = logger.asyncFunc(
  async ({ userId }: { userId: string }): Promise<Entity | undefined> => {
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
      const item = Entity.fromRecord(data.Item);
      return item;
    }

    return undefined;
  },
);
