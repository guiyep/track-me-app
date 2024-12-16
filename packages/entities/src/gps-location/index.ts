export type GpsLocationDataArgs = {
  email: string;
  displayName: string;
  sessionId: string;
  lat: number;
  long: number;
};

export type GpsLocationData = GpsLocationDataArgs & {
  created: number;
  lastUpdated?: number;
};

export class GpsLocationEntity {
  protected readonly partitionKey: string;
  protected readonly sortKey: string;
  readonly data: GpsLocationData;

  constructor(data: GpsLocationDataArgs) {
    this.data = this.hydrateData(data);
    this.partitionKey = data.email;
    this.sortKey = data.sessionId;
  }

  private hydrateData(data: GpsLocationDataArgs): GpsLocationData {
    const dataWithTimestamp: GpsLocationData = {
      ...data,
      created: Date.now(),
    };
    return dataWithTimestamp;
  }

  setLastUpdated(): void {
    this.data.lastUpdated = Date.now();
  }
}
