import { HttpClient } from '../utils/http.client';
import { config } from '../config';

export class CommentsService {
    static api: string = `${config.endpoints.comments.hostname}:${config.endpoints.comments.port}${config.endpoints.comments.api}`;

    static doesExist(commentId: string, authorizationHeader: string) {
        return HttpClient.head(`${CommentsService.api}/${commentId}`, null, authorizationHeader);
    }
}
