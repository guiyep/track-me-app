import addLocationRoute from './add-location/index';
import addLocationsRoute from './add-locations/index';
import startSessionRoute from './start-session/index';
import endSessionRoute from './end-session/index';
import getSessionRoute from './get-session/index';
import saveSettingsRoute from './save-settings/index';
import getSettingsRoute from './get-settings/index';

export default [
  getSessionRoute,
  addLocationRoute,
  addLocationsRoute,
  startSessionRoute,
  endSessionRoute,
  saveSettingsRoute,
  getSettingsRoute,
];
