import { HttpClient } from '../utils/http.client';
import { config } from '../config';

export class ReactionsService {
    static api: string = `${config.endpoints.reactions.hostname}:${config.endpoints.reactions.port}${config.endpoints.reactions.api}`;

    static create(body: any, authorizationHeader: string) {
        return HttpClient.post(`${ReactionsService.api}`, body, authorizationHeader);
    }

    static getReactionAmountByTypeAndResourceType(query: any, authorizationHeader: string) {
        return HttpClient.get(`${ReactionsService.api}/reaction/amount`, query, authorizationHeader);
    }

    static getMany(query: any, authorizationHeader: string) {
        return HttpClient.get(`${ReactionsService.api}/many`, query, authorizationHeader);
    }
}
