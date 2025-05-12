import { logger } from '@track-me-app/logger';
import { locationAddedHandler } from './location-added';
import { Settings, GpsLocation } from '@track-me-app/be-entities';
import { getConstants } from '@track-me-app/be-consts';
import type {
  GpsTableData,
  GpsTableSettingData,
} from '@track-me-app/gps-table';
import { settingsAddedHandler } from './setting-added';

const Consts = getConstants();

type MessageType =
  (typeof Consts.GpsSns.MESSAGES)[keyof typeof Consts.GpsSns.MESSAGES];

export const messagesHandler = logger.asyncFunc(
  async ({ type, dataJson }: { type: MessageType; dataJson: string }) => {
    switch (type) {
      case Consts.GpsSns.MESSAGES.LOCATION_ADDED: {
        const data = JSON.parse(dataJson) as GpsTableData;
        await locationAddedHandler(new GpsLocation.Entity(data));
        break;
      }
      case Consts.GpsSns.MESSAGES.SETTINGS_ADDED: {
        const data = JSON.parse(dataJson) as GpsTableSettingData;
        await settingsAddedHandler(new Settings.Entity(data));
        break;
      }
      default:
        break;
    }
  },
);
