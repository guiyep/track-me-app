import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';

const Consts = getConstants();

export type LatestSessionData = {
  sessionId: string | undefined;
  email: string;
};

export class LatestSessionEntity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: LatestSessionData;

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    const latestSessionData = unmarshall(dynamoData) as LatestSessionData;
    return new LatestSessionEntity(latestSessionData);
  }

  constructor({ sessionId, email }: LatestSessionData) {
    this.partitionKey = email;
    this.sortKey = Consts.GpsTable.LATEST_SESSION_KEY;
    this.data = {
      sessionId,
      email,
    };
  }
}
