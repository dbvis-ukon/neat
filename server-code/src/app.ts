import * as express from "express";
import * as expressWs from 'express-ws'
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as dbMiddleware from './middleware/rethink-db';

import indexRouter from './routes/index';
import { ApiError } from "./utils/error";
import { verifyGroupId } from "./middleware/verify-group-id";
import groupRouter from "./routes/group";
import timeWsRouter from "./routes/groupsettings";
import { GroupSettingsService } from "./services/groupsettings";

const expWs = expressWs(express());
const app: expressWs.Application = expWs.app

const testRouter: expressWs.Router = express.Router();

testRouter.ws('/', (ws: any, req) => {
     ws.testParam = 'this is a test ' + Math.random()

     console.log('connection attempt')
     ws.on('message', (d) => {
          ws.send(d)
     })

     expWs.getWss().clients.forEach((c: any) => {
          console.log('client', c.testParam)
     })
})

app.use('/test', testRouter)


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
app.use('/groupsettings', verifyGroupId, timeWsRouter)


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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
})
