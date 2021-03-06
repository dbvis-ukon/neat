import * as express from "express";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as dbMiddleware from './middleware/rethink-db.middleware';
import * as http from 'http';
import * as cors from 'cors';

import { ApiError } from "./utils/error";
import groupRouter from "./routes/group.route";
// import timeWsRouter from "./routes/groupsettings";
import userOptionsRouter from "./routes/user-options.route";
import { MyStompServer } from "./utils/stomp-server";
import { RethinkDbService } from "./services/rethink-db.service";

const app: express.Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use(dbMiddleware.connect)

// create all required tables:
RethinkDbService.connect().then(async conn => {
    await RethinkDbService.createTableIfItDoesNotExist('groups', conn, {primary_key: 'groupId'});
    await RethinkDbService.createTableIfItDoesNotExist('user_options', conn, {primary_key: 'id'})
})


app.use('/api/health', (req, res) => {
     res.send('OK')
})

app.use('/api/group', groupRouter)

app.use('/api/user', userOptionsRouter);

app.use(dbMiddleware.close)

// index
app.use('/', express.static(path.join(__dirname, '../public')));

// to make the angular routing possible
app.use('*', (req, res) => {
    console.log('send file', __dirname);
     res.sendFile(path.join(__dirname, '../public/index.html'));
});

/* custom error handler */
app.use( ( error, request, response, next ) => {
    console.log('caught error', error);
    response.status( error.status || 500 );
    response.json( {
        error: error.message
    });
});

 app.use( ( request, response, next ) => {
     let error = new ApiError('Not found', 404);
     response.json( error );
 } );

const PORT = parseInt(process.env.PORT) || 3000;

const server = http.createServer(app);

const stompServer = MyStompServer.init(server);

stompServer.subscribe('/echo', (msg, headers) => {
    var topic = headers.destination;
    console.log(headers);
    console.log(`topic:${topic} messageType: ${typeof msg}`, msg, headers);
    stompServer.send('/echo', headers, `Hello from server! ${msg}`);
});


 server.listen(PORT, '0.0.0.0', () => {
     console.log(`Server is running in http://localhost:${PORT}`)
 });
