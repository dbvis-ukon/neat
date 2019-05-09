import * as express from "express";
import * as r from 'rethinkdb';
import { DB_NAME } from "../config/database";
import * as expressWs from "express-ws";

// var express = require('express');
// var app = express();
// var expressWs = require('express-ws');

expressWs(express())

const timeWsRouter: any = express.Router();

timeWsRouter.ws('/', (ws, req: any) => {
    
    r.db(DB_NAME).tableCreate('groupsettings').run(req._rdb)

    r.db(DB_NAME).table('groupsettings')
        .getAll(req._groupId)
        .changes()
        .run(req._rdb, (err, res) => {
            console.log('test', res);
        })

    ws.on('message', function(msg) {
      ws.send(msg);
    });
    console.log('successful connection')

    console.log(ws)
  });

export default timeWsRouter;