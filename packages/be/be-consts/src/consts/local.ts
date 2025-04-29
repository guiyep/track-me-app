export const ReportQueue = {
  QUEUE_NAME: 'ReportQueue',
  QUEUE_URL:
    'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/ReportQueue',
  GPS_LOCATION_ADDED_COMMAND: 'GPS_LOCATION_ADDED',
  DLQ: 'GpsDLQ',
};

export const GpsTable = {
  TABLE_NAME: 'GpsLocations',
  LATEST_SESSION_KEY: 'latestSession',
  SETTING_KEY: 'setting',
};

export const ReportTable = {
  TABLE_NAME: 'Reports',
};

export const GpsSns = {
  TOPIC_NAME: 'GpsLocationTopic',
};
