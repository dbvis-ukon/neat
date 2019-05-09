import * as express from "express";
import * as uuid from 'uuid/v4';
import * as r from 'rethinkdb';
import { DB_NAME } from "../config/database";

const groupRouter: express.Router = express.Router();


/* get a new group id. */
groupRouter.post('/', (req: any, res, next) => {
    const sessionObj = {
        groupId: uuid(),
        created: new Date()
    }

    r.db(DB_NAME).tableCreate('groups', {primary_key: 'groupId'}).run(req._rdb)

    r.db(DB_NAME).table('groups').insert(sessionObj).run(req._rdb, (err, res2) => {
        if(err) throw err

        console.log(res2)


        res.send(sessionObj)
    })

    
});

export default groupRouter;