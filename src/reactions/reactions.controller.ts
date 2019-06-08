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

    static async getReactionAmountByTypeAndResourceType(req: Request, res: Response) {
        const resourceReactions: any[] = await ReactionsService.getReactionAmountByTypeAndResourceType(req.query, req.headers.authorization!);

        res.json(await ReactionsController.popolateVideos(resourceReactions, req.user));
    }

    static async getUserLikedVideos(req: Request, res: Response) {
        const reactions: any[] = await ReactionsService.getMany(req.query, req.headers.authorization!);

        res.json(await ReactionsController.popolateVideos(reactions, req.user));
    }

    private static async popolateVideos(reactions: any[], user: any) {
        const videosIds = reactions.map((reaction: any) => reaction.resource);
        const videosMap = await VideosRpc.getVideos(videosIds, user.id).catch((error) => {
            log('warn', 'Video Rpc request failed - getVideos', error.message, '', user ? user.id : 'unknown', { error });
            return [];
        });

        const channelsIds = Object.keys(videosMap).map((video: any) => video.channel);
        const channelsMap = await ChannelsRpc.getChannelsByIds(channelsIds).catch((error) => {
            log('warn', 'Channels Rpc request failed - getChannelsByIds', error.message, '', user ? user.id : 'unknown', { error });
            return [];
        });

        const reactionWithResource = reactions
            .map((reaction) => {
                return {
                    ...reaction,
                    resource: videosMap[reaction.resource] || reaction.resource,
                };
            });

            return reactionWithResource
            .map((reaction) => {
                return {
                    ...reaction,
                    resource: {
                        ...reaction.resource,
                        channel: reaction.resource.channel ?
                            channelsMap[reaction.resource.channel] || reaction.resource.channel :
                            undefined,
                    },
                }
            });
    }
}
