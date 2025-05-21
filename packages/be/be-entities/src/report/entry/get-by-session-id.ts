import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import { Entity } from './entity';

const Consts = getConstants();

const loggerA = logger.decorate({
  name: 'getBySessionId',
  folder: 'report/entry',
});

export const getBySessionId = loggerA.asyncFunc(
  async (sessionId: string): Promise<Entity[]> => {
    const client = new DynamoDBClient();

    const params = {
      TableName: Consts.ReportTable.TABLE_NAME,
      KeyConditionExpression: 'partitionKey = :sessionId',
      ExpressionAttributeValues: {
        ':sessionId': { S: sessionId },
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
