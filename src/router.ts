import { Router } from 'express';
import { ReactionsRouter } from './reactions/reactions.router';
import { config } from './config';

const AppRouter: Router = Router();

AppRouter.use(config.endpoints.reactions.api, ReactionsRouter);

export { AppRouter };
