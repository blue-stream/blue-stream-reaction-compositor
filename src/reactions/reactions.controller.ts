import { Request, Response } from 'express';
import { CommentsService } from '../comments/comments.service';
import { VideosService } from '../videos/videos.service';
import { ReactionsService } from './reactions.service';
import { VideosRpc } from '../videos/videos.rpc';
import { log } from '../utils/logger';
import { ChannelsRpc } from '../channels/channels.rpc';

export class ReactionsController {
    static async create(req: Request, res: Response) {
        if (req.body.resourceType === 'COMMENT') {
            await CommentsService.doesExist(req.body.resource, req.headers.authorization!);
        } else if (req.body.resourceType === 'VIDEO') {
            await VideosService.doesExist(req.body.resource, req.headers.authorization!);
        }

        res.json(await ReactionsService.create(req.body, req.headers.authorization!));
    }

    static async canGetReactionAmountByTypeAndResourceType(req: Request, res: Response) {
        const resourceReactions: any[] = await ReactionsService.getReactionAmountByTypeAndResourceType(req.query, req.headers.authorization!);
        const videosIds = resourceReactions.map((resourceReaction: any) => resourceReaction.resource);

        const videosMap = await VideosRpc.getVideos(videosIds, req.user.id).catch((error) => {
            log('warn', 'Video Rpc request failed - getVideos', error.message, '', req.user ? req.user.id : 'unknown', { error });
            return [];
        });

        const channelsIds = Object.keys(videosMap).map((video: any) => video.channel);
        const channelsMap = await ChannelsRpc.getChannelsByIds(channelsIds).catch((error) => {
            log('warn', 'Channels Rpc request failed - getChannelsByIds', error.message, '', req.user ? req.user.id : 'unknown', { error });
            return [];
        });

        const reactionWithResource = resourceReactions.map(
            (resourceReaction) => {
                return {
                    ...resourceReaction,
                    resource: videosMap[resourceReaction.resource] || resourceReaction.resource,
                };
            });

        return res.json(reactionWithResource.map(
            (resourceReaction) => {
                return {
                    ...resourceReaction,
                    resource: {
                        ...resourceReaction.resource,
                        channel: channelsMap[resourceReaction.resource.channel] || resourceReaction.resource.channel,
                    },
                }
            }));
    }
}
