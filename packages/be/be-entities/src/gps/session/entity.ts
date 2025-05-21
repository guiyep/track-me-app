import { unmarshall } from '@aws-sdk/util-dynamodb';
import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { GpsTableLatestSessionData } from '@track-me-app/gps-table';

const Consts = getConstants();

const loggerEntity = logger.decorate({
  name: 'Entity',
  folder: 'gps/session/entity',
});

const loggerA = loggerEntity.decorate({
  name: 'fromRecord',
});

export class Entity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: GpsTableLatestSessionData;

  static fromRecord = loggerA.syncFunc(
    (dynamoData: Record<string, AttributeValue>): Entity => {
      const sessionEntity = unmarshall(dynamoData) as Entity;
      return new Entity(sessionEntity.data);
    },
  );

  constructor({ sessionId, userId }: GpsTableLatestSessionData) {
    loggerA.log({ message: 'new Entity' }, { sessionId, userId });
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
