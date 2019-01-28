import * as proxy from 'http-proxy-middleware';
import { config } from './config';

const reactionsApi: string = `${config.endpoints.reactions.hostname}:${config.endpoints.reactions.port}`;

const restream = (proxyReq: any, req: any, res: any) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // stream the content
        proxyReq.write(bodyData);
    }
};

const ReactionsProxy = proxy({ target: reactionsApi, onProxyReq: restream });

export { ReactionsProxy };
