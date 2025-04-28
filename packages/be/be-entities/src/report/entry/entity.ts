import { logger } from '@track-me-app/logger';
import type { ReportTableData } from '@track-me-app/report-table';
import type { GpsLocation } from '../..';

export class Entity {
  readonly partitionKey: string;
  readonly sortKey: string;
  readonly data: ReportTableData;

  static fromGpsLocation = logger.syncFunc(
    (location: GpsLocation.Entity): Entity => {
      return new Entity({
        userId: location.data.userId,
        sessionId: location.data.sessionId,
        lat: location.data.lat,
        long: location.data.long,
        gpsInfo: location.data.gpsInfo,
        signalInfo: location.data.signalInfo,
        batteryInfo: location.data.batteryInfo,
        created: location.data.created,
      });
    },
  );

  constructor(data: Omit<ReportTableData, 'lastUpdated'>) {
    this.data = this.hydrateData(data);
    this.partitionKey = data.sessionId;
    this.sortKey = `tracking:${data.userId}/created:${data.created.toString()}`;
  }

  private hydrateData(
    data: Omit<ReportTableData, 'lastUpdated'>,
  ): ReportTableData {
    const timestamp = Date.now();
    return {
      ...data,
      lastUpdated: timestamp,
    };
  }
}
