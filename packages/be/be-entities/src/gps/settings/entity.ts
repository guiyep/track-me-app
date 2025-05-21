import type { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { GpsTableSettingData } from '@track-me-app/gps-table';

const Consts = getConstants();

const loggerEntity = logger.decorate({
  name: 'Entity',
  folder: 'gps/settings/entity',
});

const loggerA = loggerEntity.decorate({
  name: 'fromRecord',
});

export class Entity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string = Consts.GpsTable.SETTING_KEY;
  readonly data: GpsTableSettingData;

  static fromRecord = loggerA.syncFunc(
    (dynamoData: Record<string, AttributeValue>): Entity => {
      const settingsEntity = unmarshall(dynamoData) as Entity;
      return new Entity(settingsEntity.data);
    },
  );

  constructor({ userId, ...rest }: GpsTableSettingData) {
    loggerA.log({ message: 'new Entity' }, { userId });
    this.partitionKey = userId;
    this.data = {
      userId,
      ...rest,
    };
  }
}
