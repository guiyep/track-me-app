import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { GpsTableSettingData } from '@track-me-app/gps-table';

const Consts = getConstants();

export class Entity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string = Consts.GpsTable.SETTING_KEY;
  readonly data: GpsTableSettingData;

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    logger.log({ message: 'Entity -> fromRecord' }, { dynamoData });
    const settingsEntity = unmarshall(dynamoData) as Entity;
    logger.log({ message: 'Entity -> unmarshall' }, settingsEntity);
    return new Entity(settingsEntity.data);
  }

  constructor({ userId, ...rest }: GpsTableSettingData) {
    logger.log({ message: 'new Entity' }, { userId });
    this.partitionKey = userId;
    this.data = {
      userId,
      ...rest,
    };
  }
}
