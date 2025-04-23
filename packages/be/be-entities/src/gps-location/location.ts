import { GpsLocationEntity } from '@track-me-app/entities';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import * as z from 'zod';

const Consts = getConstants();

export const validate = (data: unknown): void => {
  const gpsInfoSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    altitude: z.number(),
    accuracy: z.number(),
    altitudeAccuracy: z.number(),
    heading: z.number(),
    speed: z.number(),
  });

  const wifiSignalInfoSchema = z.object({
    type: z.literal('wifi'),
    isConnected: z.boolean(),
    strength: z.number(),
    frequency: z.number(),
  });

  const cellularSignalInfoSchema = z.object({
    type: z.literal('cellular'),
    isConnected: z.boolean(),
    isInternetReachable: z.boolean(),
    cellularGeneration: z.enum(['3g', '4g', '5g']),
    carrier: z.string(),
    isConnectionExpensive: z.boolean(),
    strength: z.number(),
  });

  const signalInfoSchema = z.discriminatedUnion('type', [
    wifiSignalInfoSchema,
    cellularSignalInfoSchema,
  ]);

  const batteryInfoSchema = z.object({
    batteryLevel: z.number().min(0).max(100),
    batteryState: z.enum(['charging', 'discharging', 'full']),
    chargingSource: z.enum(['AC', 'USB', 'wireless', 'unknown']).optional(),
    chargingStatus: z.boolean(),
    batteryHealth: z.enum(['good', 'poor', 'unknown']).optional(),
  });

  const schema = z.object({
    userId: z.string(),
    sessionId: z.string().min(1),
    lat: z.number().refine((val) => val >= -90 && val <= 90, {
      message: 'Latitude must be between -90 and 90',
    }),
    long: z.number().refine((val) => val >= -180 && val <= 180, {
      message: 'Longitude must be between -180 and 180',
    }),
    gpsInfo: gpsInfoSchema,
    signalInfo: signalInfoSchema,
    batteryInfo: batteryInfoSchema,
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

export const get = logger.func(
  async ({
    userId,
    sessionId,
  }: {
    userId: string;
    sessionId: string;
  }): Promise<GpsLocationEntity | undefined> => {
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
      const item = GpsLocationEntity.fromRecord(data.Item);
      return item;
    }

    return undefined;
  },
);
