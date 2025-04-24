import { SettingsEntity } from '@track-me-app/entities';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import { GpsTableSettingData } from '@track-me-app/gps-table';
import { z } from 'zod';
const Consts = getConstants();

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
  async (data: GpsTableSettingData): Promise<GpsTableSettingData> => {
    const client = new DynamoDBClient();
    await client.send(
      new PutItemCommand({
        TableName: Consts.GpsTable.TABLE_NAME,
        Item: marshall(new SettingsEntity(data), {
          convertClassInstanceToMap: true,
        }),
      }),
    );

    return data;
  },
);

export const get = logger.asyncFunc(
  async ({
    userId,
  }: {
    userId: string;
  }): Promise<SettingsEntity | undefined> => {
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
      const item = SettingsEntity.fromRecord(data.Item);
      return item;
    }

    return undefined;
  },
);
