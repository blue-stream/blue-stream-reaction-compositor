import { Router } from 'express';
import { ReactionsProxy } from './proxies';
import { config } from './config';

const AppProxyRouter: Router = Router();

AppProxyRouter.use(config.endpoints.reactions.api, ReactionsProxy);

export { AppProxyRouter };
