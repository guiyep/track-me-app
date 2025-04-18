export const GpsLocationsQueue = {
  QUEUE_NAME: 'GpsQueue',
  QUEUE_URL:
    'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/GpsQueue',
  GPS_LOCATION_ADDED_COMMAND: 'GPS_LOCATION_ADDED',
  DLQ: 'GpsDLQ',
};

export const GpsTable = {
  TABLE_NAME: 'GpsLocations',
  LATEST_SESSION_KEY: 'latestSession',
};
