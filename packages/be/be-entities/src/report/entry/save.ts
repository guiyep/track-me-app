import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { Entity } from './entity';

const Consts = getConstants();

export const save = logger.asyncFunc(
  async (entity: Entity): Promise<Entity> => {
    const client = new DynamoDBClient();

    const params = {
      TableName: Consts.ReportTable.TABLE_NAME,
      Item: marshall(entity, { convertClassInstanceToMap: true }),
    };

    const command = new PutItemCommand(params);
    await client.send(command);

    return entity;
  },
);
