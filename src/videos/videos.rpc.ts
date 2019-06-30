import { config } from '../config';

const jayson = require('jayson/promise');

export class VideosRpc {
    private static rpcClient = jayson.Client.http(`${config.endpoints.videos.hostname}:${config.endpoints.videos.rpc.port}`);

    static async getVideos(videosIds: string[], userId: string) {
        const response = await VideosRpc.rpcClient.request(config.endpoints.videos.rpc.methods.GET_VIDEOS, videosIds, userId);

        return response.result;
    }
}
