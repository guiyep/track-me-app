import type { GpsLocation } from '@track-me-app/be-entities';
import type { ReportTableLocation } from '@track-me-app/report-table';

type ReportTableLocationKey = keyof ReportTableLocation;

export type FetcherFunction<T> = (
  location: GpsLocation.Entity,
) => Promise<[ReportTableLocationKey, T]>;
