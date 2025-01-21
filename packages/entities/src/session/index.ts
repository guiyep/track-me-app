import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';

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
    const SessionData = unmarshall(dynamoData) as SessionData;
    return new SessionEntity(SessionData);
  }

  constructor({ sessionId, email }: SessionData) {
    this.partitionKey = email;
    // the session data will always have sorting key as LATEST_SESSION_KEY
    this.sortKey = Consts.GpsTable.LATEST_SESSION_KEY;
    this.data = {
      email,
      // the session will change only based on the session that is running
      ...(sessionId !== undefined ? { sessionId } : {}),
    };
  }
}
