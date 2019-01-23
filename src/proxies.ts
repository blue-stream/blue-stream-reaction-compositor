import * as proxy from 'http-proxy-middleware';
import { config } from './config';

const reactionsApi: string = `${config.endpoints.reactions.hostname}:${config.endpoints.reactions.port}`;

const ReactionsProxy = proxy({ target: reactionsApi });

export { ReactionsProxy };
