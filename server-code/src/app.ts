import * as express from "express";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as dbMiddleware from './middleware/rethink-db';
import * as StompServer from 'stomp-broker-js';
import * as http from 'http';

import indexRouter from './routes/index';
import { ApiError } from "./utils/error";
import { verifyGroupId } from "./middleware/verify-group-id";
import groupRouter from "./routes/group";
// import timeWsRouter from "./routes/groupsettings";
import { GroupSettingsService } from "./services/groupsettings";

const app: express.Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// app.get("/", (req, res) => {
//     res.send("Hello World")
// })

app.use(dbMiddleware.connect)

app.use('/', indexRouter);

app.use('/health', (req, res) => {
     res.send('OK')
})

app.use('/group', groupRouter)


// from here we add the verification
// app.use('/groupsettings', verifyGroupId, timeWsRouter)


app.use(dbMiddleware.close)

app.use( ( error, request, response, next ) => {
     response.status( error.status || 500 );
     response.json( {
         error: error.message
     } );
 } );
 
 app.use( ( request, response, next ) => {
     let error = new ApiError('Not found');
     error.status = 404;
     response.json( error );
 } );


GroupSettingsService.listenForChangesAndBroadcast()

const PORT = parseInt(process.env.PORT) || 3000;

const server = http.createServer(app);


// const httpServer = app.listen(PORT, () => {
//      console.log(`Server is running in http://localhost:${PORT}`)
// })

const stompServer = new StompServer({
     server: server,
     debug: console.log,
     path: '/ws',
     // protocol: 'sockjs',
     heartbeat: [2000,2000]
 });

 stompServer.subscribe('/echo', (msg, headers) => {
     var topic = headers.destination;
     console.log(headers);
     console.log(`topic:${topic} messageType: ${typeof msg}`, msg, headers);
     stompServer.send('/echo', headers, `Hello from server! ${msg}`);
 });


 server.listen(PORT, '0.0.0.0', () => {
     console.log(`Server is running in http://localhost:${PORT}`)
 });
