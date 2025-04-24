import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import type { GpsTableData, GpsTableInfo } from '@track-me-app/gps-table';
import type { SqsAttributesMessage } from '@track-me-app/be-entities';
import type { SQSMessageAttributes } from 'aws-lambda';
import { logger } from '@track-me-app/logger';
import { unmarshallSqsAttributes } from '@track-me-app/aws';
export class GpsLocationEntity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: GpsTableData;

  constructor(data: GpsTableInfo) {
    this.data = this.hydrateData(data);
    this.partitionKey = data.userId;
    this.sortKey = `sessionId:${data.sessionId}/created:${this.data.created.toString()}`;
  }

  static fromRecord = logger.syncFunc(
    (dynamoData: Record<string, AttributeValue>): GpsLocationEntity => {
      const entity = unmarshall(dynamoData) as GpsLocationEntity;
      return new GpsLocationEntity(entity.data);
    },
  );

  static fromSqs = logger.syncFunc(
    (sqsData: SQSMessageAttributes): GpsLocationEntity => {
      const entity = unmarshallSqsAttributes(sqsData) as SqsAttributesMessage;
      const data = JSON.parse(entity.data) as GpsTableData;
      return new GpsLocationEntity(data);
    },
  );

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
