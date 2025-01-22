import { SessionData, SessionEntity } from '@track-me-app/entities';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import * as z from 'zod';

const Consts = getConstants();

export const validate = (data: unknown): void => {
  logger.log({ message: 'Validating session' }, data);

  const schema = z.object({
    email: z.string().email(),
    sessionId: z.string().min(1),
  });

  schema.parse(data);
};

export const save = async ({
  sessionId,
  email,
}: SessionData): Promise<SessionData> => {
  const client = new DynamoDBClient();
  await client.send(
    new PutItemCommand({
      TableName: Consts.GpsTable.TABLE_NAME,
      Item: marshall(new SessionEntity({ sessionId, email }), {
        convertClassInstanceToMap: true,
      }),
    }),
  );

  logger.log({ message: 'PutItemCommand -> done' }, { sessionId, email });

  return { sessionId, email };
};

export const get = async ({
  email,
}: {
  email: string;
}): Promise<SessionEntity | undefined> => {
  const client = new DynamoDBClient();
  const data = await client.send(
    new GetItemCommand({
      TableName: Consts.GpsTable.TABLE_NAME,
      Key: {
        PK: marshall(email),
        SK: marshall(Consts.GpsTable.LATEST_SESSION_KEY),
      },
    }),
  );

  logger.log({ message: 'GetItemCommand -> done' }, { item: data.Item, email });

  if (data.Item) {
    const item = SessionEntity.fromRecord(data.Item);
    return item;
  }

  return undefined;
};
