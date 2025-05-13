import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { getConstants } from '@track-me-app/be-consts';
import { logger } from '@track-me-app/logger';
import type { GpsLocation, GpsSettings } from '..';

const Consts = getConstants();

export const sendLocationAddedNotification = logger.asyncFunc(
  async ({ entity }: { entity: GpsLocation.Entity }): Promise<void> => {
    const snsClient = new SNSClient({ region: Consts.GpsSns.REGION });

    const command = new PublishCommand({
      TopicArn: Consts.GpsSns.TOPIC_ARN,
      Message: JSON.stringify(entity.data),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: Consts.GpsSns.MESSAGES.LOCATION_ADDED,
        },
      },
    });

    logger.log(
      {
        message: `Sending location using command`,
      },
      command,
    );

    await snsClient.send(command);
  },
  'send_location_added_sns',
);

export const sendSettingsAddedNotification = logger.asyncFunc(
  async ({ entity }: { entity: GpsSettings.Entity }): Promise<void> => {
    const snsClient = new SNSClient({ region: Consts.GpsSns.REGION });

    const command = new PublishCommand({
      TopicArn: Consts.GpsSns.TOPIC_ARN,
      Message: JSON.stringify(entity.data),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: Consts.GpsSns.MESSAGES.SETTINGS_ADDED,
        },
      },
    });

    logger.log(
      {
        message: `Sending settings using command`,
      },
      command,
    );

    await snsClient.send(command);
  },
  'send_settings_added_sns',
);
