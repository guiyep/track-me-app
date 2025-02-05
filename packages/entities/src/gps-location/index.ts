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
    this.sortKey = `sessionId:${data.sessionId}/created:${this.data.created.toString()}`;
  }

  private hydrateData(data: GpsLocationDataArgs): GpsLocationData {
    const timestamp = Date.now();
    return {
      ...data,
      created: timestamp,
    };
  }

  setLastUpdated(): void {
    this.data.lastUpdated = Date.now();
  }
}
