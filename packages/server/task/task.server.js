import express from 'express';
import config from 'config';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';

import Helmet from 'helmet';
import Compression from 'compression';
import cookieParser from 'cookie-parser';
import fileStreamRotator from 'file-stream-rotator';
import morgan from 'morgan';
import Server from 'http';
import MongoConnect from './resources/database/mongo.database.js';
import Routes from './resources/routes/public.routes.js';
import Logger from './resources/logs/logger.log.js';
import SockJsClient from './utils/notification.client.js';
import {auth, swaggerAuthLogger} from './resources/views/swaggerAuth.js';

const mongoConnect = new MongoConnect();
const app = express();
const server = Server.Server(app);

app.use(Helmet(), Compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' }));
app.use(express.static('./resources/logs/responselogs'));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));

if (process.env.IS_DEBUGGING) console.log(__filename);
const swaggerFile = JSON.parse(fs.readFileSync('./resources/views/swagger-api-view.json', 'utf-8'));

const __dirname = path.resolve();
const logDir = `${__dirname}/resources/logs/responselogs`;
// Stream information for log name and frequency
const stream = fileStreamRotator.getStream({
    filename: path.join(logDir, '%DATE%-logs.log'),
    frequency: 'daily',
    verbose: false,
    datePattern: 'YYYY-MM-DD',
    max_logs: '7d',
    size: '100M',
});

app.use(morgan('tiny', { stream: Logger.stream }));

if (app.get('env') !== 'local') {
    app.use(morgan('dev'));
    morgan.token('url', (req, res) => req.path);
    app.use(
        morgan(':method :url :status :res[content-length] :response-time ms', {
            stream,
        })
    );
}

// for reading req body
app.use(
    express.json({ limit: '50mb' }),
    express.urlencoded({
        limit: '50mb',
        urlencoded: false,
        extended: true,
    })
);

// Set response header
app.use((req, res, next) => {
    res.set({
        // compress: true,
        Conenction: 'keep-alive',
        'Keep-Alive': 'timeout=300',
    });
    // res.on("finish", function () {
    //   console.log("after", res);
    //   recent-visited(req, res)
    // });
    next();
});

process
    .on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection: ', reason, 'Promise', promise);
        Logger.error(`: ---- : unhandledRejection : ---- : ${reason} : ---- : Unhandled Rejection at Promise : ---- : ${promise} : ---- :`);
    })
    .on('warning', (reason, promise) => {
        Logger.error(`: ---- :warning : ---- : ${reason} : ---- : warning message : ---- : ${promise} : ---- :`);
    })
    .on('uncaughtException', err => {
        console.log('Uncaught Exception:', err);
        Logger.error(`: ---- : uncaughtException : ---- : ${err} : ---- : Uncaught Exception thrown : ---- :`);
        process.exit(1);
    });
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'emp-project-task', version: '1.0.0', timestamp: new Date().toISOString() });
});

    app.get('/',(req,res,next)=>{
        res.send("Working.......!");
    })
app.use('/explorer',auth, swaggerAuthLogger, swaggerUi.serve, swaggerUi.setup(swaggerFile));
// app.get('/', (req, res) => res.redirect('/explorer'));

const startServer = () =>
    new Promise((resolve, reject) => {
        const port = config.get('task.port');

        server.listen(port, () => {
            Logger.info(`Task service listening on ${config.get('task.host_url')} with ${process.env.NODE_ENV} Environment!`);
            console.log(`Task service listening on ${config.get('task.host_url')} with ${process.env.NODE_ENV} Environment!`);
        });
        resolve(true);
    });

mongoConnect
    .initialize()
    .then(() => {
        const routes = new Routes(app);
        return routes;
    })
    .then(() => startServer())
    .catch(error => {
        console.log(`Error: ${error}`);
        Logger.error(error.message);
    });

// SockJsClient connecting to SockJs Server
const serverUrl = config.get('notification_server_url');
const SockClient = new SockJsClient(serverUrl);
export default SockClient;
