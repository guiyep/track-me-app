import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { GpsTableSettingData } from '@track-me-app/gps-table';
import { z } from 'zod';

const Consts = getConstants();

export class Entity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string = Consts.GpsTable.SETTING_KEY;
  readonly data: GpsTableSettingData;

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    logger.log({ message: 'Entity -> fromRecord' }, { dynamoData });
    const settingsEntity = unmarshall(dynamoData) as Entity;
    logger.log({ message: 'Entity -> unmarshall' }, settingsEntity);
    return new Entity(settingsEntity.data);
  }

  constructor({ userId, ...rest }: GpsTableSettingData) {
    logger.log({ message: 'new Entity' }, { userId });
    this.partitionKey = userId;
    this.data = {
      userId,
      ...rest,
    };
  }
}

export const validate = (data: unknown): void => {
  const schema = z.object({
    userId: z.string(),
    displayName: z.string(),
    name: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().optional(),
    profilePictureUrl: z.string().url().optional(),
    isEmailVerified: z.boolean(),
    isPhoneNumberVerified: z.boolean().optional(),
  });

  schema.parse(data);
};

export const save = logger.asyncFunc(
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

export const get = logger.asyncFunc(
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
