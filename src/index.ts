import expressListEndpoints from 'express-list-endpoints';
import cors from "cors";
import express from "express";
import http from "http";
import routerFeature from './features/routes';
import { logger } from '@/utils/lib/logger';
import { Repositories } from '@/repositories/index';
import { Models } from '@/models/index';
import { loadConfig } from '@/utils/helper';
import DBConnection from '@/utils/lib/postgres';

const runApp = async () => {
    loadConfig()
    const app = express();
    const dataSource = await DBConnection.connect();
    
    app.use(cors());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const model = await Models.new(dataSource);
    const repo = await Repositories.new();

    const router = routerFeature({ model, repo });

    app.use(router.router);

    const httpsServer = http.createServer(app);
    router.socket.runServer(httpsServer);

    const PORT = 8080;

    httpsServer.listen(PORT, () => {
        logger.log(`Server in Development Mode and Listening on port ${PORT}`, '');
        if (process.env.ENV !== 'production') {
            console.log(expressListEndpoints(app))
        }
    });

    return { app, httpsServer };
}

export default runApp();