import { logger } from '@track-me-app/logger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import type { GpsTableData, GpsTableInfo } from '@track-me-app/gps-table';

export class GpsLocationEntity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: GpsTableData;

  constructor(data: GpsTableInfo) {
    this.data = this.hydrateData(data);
    this.partitionKey = data.email;
    this.sortKey = `sessionId:${data.sessionId}/created:${this.data.created.toString()}`;
  }

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    logger.log({ message: 'GpsLocationEntity -> fromRecord' }, { dynamoData });
    const entity = unmarshall(dynamoData) as GpsLocationEntity;
    logger.log({ message: 'GpsLocationEntity -> unmarshall' }, entity);
    return new GpsLocationEntity(entity.data);
  }

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
