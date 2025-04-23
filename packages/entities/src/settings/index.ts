import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import { GpsTableSettingData } from '@track-me-app/gps-table';

const Consts = getConstants();

export class SettingsEntity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string = Consts.GpsTable.SETTING_KEY;
  readonly data: GpsTableSettingData;

  static fromRecord(dynamoData: Record<string, AttributeValue>) {
    logger.log({ message: 'SettingsEntity -> fromRecord' }, { dynamoData });
    const settingsEntity = unmarshall(dynamoData) as SettingsEntity;
    logger.log({ message: 'SettingsEntity -> unmarshall' }, settingsEntity);
    return new SettingsEntity(settingsEntity.data);
  }

  constructor({ userId, ...rest }: GpsTableSettingData) {
    logger.log({ message: 'new SettingsEntity' }, { userId });
    this.partitionKey = userId;
    this.data = {
      userId,
      ...rest,
    };
  }
}
