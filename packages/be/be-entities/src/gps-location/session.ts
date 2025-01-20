import { LatestSessionData, LatestSessionEntity } from '@track-me-app/entities';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import { InvalidOperation } from '@track-me-app/errors';
import * as z from 'zod';

const Consts = getConstants();

export const validate = (data: unknown): void => {
  logger.log({ message: 'validating session' }, data);

  const schema = z.object({
    email: z.string().email(),
    sessionId: z.string().min(1),
  });

  schema.parse(data);
};

export const save = async ({
  sessionId,
  email,
}: LatestSessionData): Promise<LatestSessionData> => {
  logger.log({ message: 'Starting session save' }, { sessionId, email });

  const client = new DynamoDBClient();
  await client.send(
    new PutItemCommand({
      TableName: Consts.GpsTable.TABLE_NAME,
      Item: marshall(new LatestSessionEntity({ sessionId, email }), {
        convertClassInstanceToMap: true,
      }),
    }),
  );

  logger.log({ message: 'Saved new session' }, { sessionId, email });

  return { sessionId, email };
};

export const get = async ({
  sessionId,
  email,
}: LatestSessionData): Promise<LatestSessionEntity | undefined> => {
  logger.log({ message: 'Getting new session' }, { sessionId, email });

  if (sessionId == null) {
    throw new InvalidOperation({ message: 'sessionId cannot be null' });
  }

  const client = new DynamoDBClient();
  const data = await client.send(
    new GetItemCommand({
      TableName: Consts.GpsTable.TABLE_NAME,
      Key: {
        PK: marshall(email),
        SK: marshall(sessionId),
      },
    }),
  );

  logger.log(
    { message: 'GetItemCommand received' },
    { item: data.Item, email },
  );

  if (data.Item) {
    const item = LatestSessionEntity.fromRecord(data.Item);
    return item;
  }

  return undefined;
};
