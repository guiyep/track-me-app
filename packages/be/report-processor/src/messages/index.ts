import { logger } from '@track-me-app/logger';
import { locationAddedHandler } from './location-added';
import { Settings, GpsLocation } from '@track-me-app/be-entities';
import { getConstants } from '@track-me-app/be-consts';
import type {
  GpsTableData,
  GpsTableSettingData,
} from '@track-me-app/gps-table';
import { settingsAddedHandler } from './setting-added';
import { parseToEntity } from '@track-me-app/aws';

const Consts = getConstants();

type MessageType =
  (typeof Consts.GpsSns.MESSAGES)[keyof typeof Consts.GpsSns.MESSAGES];

export const messagesHandler = logger.asyncFunc(
  async ({ type, dataJson }: { type: MessageType; dataJson: string }) => {
    logger.log(
      {
        message: `Processing message`,
      },
      { type },
    );

    switch (type) {
      case Consts.GpsSns.MESSAGES.LOCATION_ADDED: {
        const data = parseToEntity<GpsTableData>(dataJson);
        await locationAddedHandler(new GpsLocation.Entity(data));
        break;
      }
      case Consts.GpsSns.MESSAGES.SETTINGS_ADDED: {
        const data = parseToEntity<GpsTableSettingData>(dataJson);
        await settingsAddedHandler(new Settings.Entity(data));
        break;
      }
      default:
        throw new Error(`Unknown message type: ${type as string}`);
    }
  },
  'messages_report_processor_handler',
);
