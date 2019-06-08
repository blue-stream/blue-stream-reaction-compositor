import { Router } from 'express';
import { ReactionsController } from './reactions.controller';
import { Wrapper } from '../utils/wrapper';

const ReactionsRouter: Router = Router();

ReactionsRouter.post('/', Wrapper.wrapAsync(ReactionsController.create));
ReactionsRouter.get('/reaction/amount', Wrapper.wrapAsync(ReactionsController.getReactionAmountByTypeAndResourceType));
ReactionsRouter.get('/user/liked/videos', Wrapper.wrapAsync(ReactionsController.getUserLikedVideos));

export { ReactionsRouter };
