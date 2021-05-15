import * as dotenv from 'dotenv';
import {configLogger} from '../logger';
import * as env from './env';

if (env.env === env.Env.Dev) {
	dotenv.config();
}

// eslint-disable-next-line import/first
import * as characters from './characters';

configLogger.debug('characters', {characters: characters.characters, length: characters.length, rewrites: characters.rewrites});
configLogger.debug('env', env.Env[env.env]);

export * as characters from './characters';
export * as env from './env';
export * as server from './server';
export * as sentry from './sentry';
export * as logger from './logger';
export * as blocklist from './blocklist';
