import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { logger } from '@track-me-app/logger';
import type { GpsTableData, GpsTableInfo } from '@track-me-app/gps-table';
import type { SqsAttributesMessage } from '@track-me-app/be-entities';
import type { SQSMessageAttributes } from 'aws-lambda';
import { unmarshallSqsAttributes } from '@track-me-app/aws';

const loggerEntity = logger.decorate({
  name: 'Entity',
  folder: 'gps/location/entity',
});

const loggerA = loggerEntity.decorate({
  name: 'fromRecord',
});

const loggerB = loggerEntity.decorate({
  name: 'fromSqs',
});

export class Entity {
  readonly partitionKey: string;
  readonly sortKey: string;
  readonly data: GpsTableData;

  constructor(data: GpsTableInfo) {
    this.data = this.hydrateData(data);
    this.partitionKey = data.userId;
    this.sortKey = `sessionId:${data.sessionId}/created:${this.data.created.toString()}`;
  }

  static fromRecord = loggerA.syncFunc(
    (dynamoData: Record<string, AttributeValue>): Entity => {
      const entity = unmarshall(dynamoData) as Entity;
      return new Entity(entity.data);
    },
  );

  static fromSqs = loggerB.syncFunc((sqsData: SQSMessageAttributes): Entity => {
    const entity = unmarshallSqsAttributes(sqsData) as SqsAttributesMessage;
    const data = JSON.parse(entity.data) as GpsTableData;
    return new Entity(data);
  });

  private hydrateData(data: GpsTableInfo): GpsTableData {
    const timestamp = Date.now();
    return {
      ...data,
      created: timestamp,
      lastUpdated: 0,
    };
  }

  setLastUpdated(): void {
    this.data.lastUpdated = Date.now();
  }
}
