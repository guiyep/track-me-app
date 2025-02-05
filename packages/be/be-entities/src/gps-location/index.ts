import * as location from './location';
import * as session from './session';
import { logger } from '@track-me-app/logger';

export const Location = logger.pkg(location);
export const Session = logger.pkg(session);
