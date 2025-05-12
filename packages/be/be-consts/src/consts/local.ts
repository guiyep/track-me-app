export const ReportQueue = {
  QUEUE_NAME: 'ReportQueue',
  QUEUE_URL:
    'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/ReportQueue',
  GPS_LOCATION_ADDED_COMMAND: 'GPS_LOCATION_ADDED',
  DLQ: 'GpsDLQ',
} as const;

export const GpsTable = {
  TABLE_NAME: 'GpsLocations',
  LATEST_SESSION_KEY: 'latestSession',
  SETTING_KEY: 'setting',
} as const;

export const ReportTable = {
  TABLE_NAME: 'Reports',
} as const;

export const GpsSns = {
  TOPIC_NAME: 'GpsLocationTopic',
  TOPIC_ARN: 'arn:aws:sns:us-east-1:000000000000:topic-2b3e92f6',
  REGION: 'us-east-1',
  MESSAGES: {
    LOCATION_ADDED: 'location-added',
    SETTINGS_ADDED: 'settings-added',
  } as const,
} as const;
