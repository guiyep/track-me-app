import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { GpsTableLatestSessionData } from '@track-me-app/gps-table';

const Consts = getConstants();

export class Entity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: GpsTableLatestSessionData;

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    logger.log({ message: 'Entity -> fromRecord' }, { dynamoData });
    const sessionEntity = unmarshall(dynamoData) as Entity;
    logger.log({ message: 'Entity -> unmarshall' }, sessionEntity);
    return new Entity(sessionEntity.data);
  }

  constructor({ sessionId, userId }: GpsTableLatestSessionData) {
    logger.log({ message: 'new Entity' }, { sessionId, userId });
    this.partitionKey = userId;
    // the session data will always have sorting key as LATEST_SESSION_KEY
    this.sortKey = Consts.GpsTable.LATEST_SESSION_KEY;
    this.data = {
      userId,
      // the session will change only based on the session that is running
      ...(sessionId ? { sessionId } : {}),
    };
  }
}
