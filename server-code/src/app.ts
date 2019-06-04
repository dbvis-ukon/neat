import * as express from "express";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as dbMiddleware from './middleware/rethink-db';
import * as StompServer from 'stomp-broker-js';
import * as http from 'http';
import * as cors from 'cors';

import indexRouter from './routes/index';
import { ApiError } from "./utils/error";
import { verifyGroupId } from "./middleware/verify-group-id";
import groupRouter from "./routes/group";
// import timeWsRouter from "./routes/groupsettings";
import { GroupSettingsService } from "./services/groupsettings";
import userOptionsRouter from "./routes/user-options";
import { MyStompServer } from "./utils/stomp-server";

const app: express.Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

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

app.use('/user', userOptionsRouter);


// from here we add the verification
// app.use('/groupsettings', verifyGroupId, timeWsRouter)


app.use(dbMiddleware.close)

/* custom error handler */
app.use( ( error: ApiError, request, response, next ) => {
    response.status( error.status || 500 );
    response.json( {
        error: error.message
    });
});

 app.use( ( request, response, next ) => {
     let error = new ApiError('Not found', 404);
     response.json( error );
 } );


GroupSettingsService.listenForChangesAndBroadcast()

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
