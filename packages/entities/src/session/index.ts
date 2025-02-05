import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';

const Consts = getConstants();

export type SessionData = {
  sessionId?: string;
  email: string;
};

export class SessionEntity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: SessionData;

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    logger.log({ message: 'SessionEntity -> fromRecord' }, { dynamoData });
    const sessionEntity = unmarshall(dynamoData) as SessionEntity;
    logger.log({ message: 'SessionEntity -> unmarshall' }, sessionEntity);
    return new SessionEntity(sessionEntity.data);
  }

  constructor({ sessionId, email }: SessionData) {
    logger.log({ message: 'new SessionEntity' }, { sessionId, email });
    this.partitionKey = email;
    // the session data will always have sorting key as LATEST_SESSION_KEY
    this.sortKey = Consts.GpsTable.LATEST_SESSION_KEY;
    this.data = {
      email,
      // the session will change only based on the session that is running
      ...(sessionId ? { sessionId } : {}),
    };
  }
}
