import { addLocationRoute } from './add-location/route';
import { addLocationsRoute } from './add-locations/route';
import { startSessionRoute } from './start-session/route';
import { endSessionRoute } from './end-session/route';
import { getSessionRoute } from './get-session/route';
import { saveSettingsRoute } from './save-settings/route';
import { getSettingsRoute } from './get-settings/route';

export const gpsRoutes = [
  getSessionRoute,
  addLocationRoute,
  addLocationsRoute,
  startSessionRoute,
  endSessionRoute,
  saveSettingsRoute,
  getSettingsRoute,
];
