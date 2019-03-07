import { Router } from 'express';
import { ReactionsRouter } from './reactions/reactions.router';
import { config } from './config';
import { HealthRouter } from './utils/health/health.router';

const AppRouter: Router = Router();

AppRouter.use(config.endpoints.reactions.api, ReactionsRouter);
AppRouter.use('/health', HealthRouter);

export { AppRouter };
