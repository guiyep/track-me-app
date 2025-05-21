import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import { Entity } from './entity';

const Consts = getConstants();

const loggerA = logger.decorate({
  name: 'getByUserId',
  folder: 'report/entry',
});

export const getByUserId = loggerA.asyncFunc(
  async (userId: string): Promise<Entity[]> => {
    const client = new DynamoDBClient();
    const sortKeyPrefix = `tracking:${userId}`;

    const params = {
      TableName: Consts.ReportTable.TABLE_NAME,
      KeyConditionExpression: 'begins_with(sortKey, :sortKeyPrefix)',
      ExpressionAttributeValues: {
        ':sortKeyPrefix': { S: sortKeyPrefix },
      },
    };

    const command = new QueryCommand(params);
    const response = await client.send(command);

    if (!response.Items) {
      return [];
    }

    const listOfEntities = response.Items.map((item) => {
      return Entity.fromRecord(item);
    });

    return listOfEntities;
  },
);
