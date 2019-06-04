import * as express from "express";
import * as uuid from 'uuid/v4';
import * as r from 'rethinkdb';
import { DB_NAME } from "../config/database";
import { RethinkDbService } from "../services/rethink-db-service";
import { Group } from '@shared';
import { ApiError } from "../utils/error";

const groupRouter: express.Router = express.Router();

/* list all routes */
groupRouter.get('/', (req: any, res) => {
    RethinkDbService.createTableIfItDoesNotExist('groups', req._rdb, {primary_key: 'groupId'}).then(() => {    
        r.db(DB_NAME).table('groups').run(req._rdb, (err, cursor) => {
            if(err) throw err

            cursor.toArray((err, dbResult) => {
                res.send(dbResult);
            })
        });
    })
});

groupRouter.get('/:groupId', (req: any, res) => {
    console.log('get group', req.params.groupId);
    r.db(DB_NAME).table('groups').get(req.params.groupId).run(req._rdb, (err, group) => {
        if(err) throw err;

        if(group === null) {
            throw new ApiError('Group ' + req.params.groupId + ' could not be found', 404);
        }

        res.send(group);
    });
});

groupRouter.get('/:groupId/users', (req: any, res) => {
    console.log('show users of ', req.params.groupId)
    r.db(DB_NAME).table('user_options').filter({groupId: req.params.groupId}).run(req._rdb, (err, cursor) => {
        if(err) throw err;

        cursor.toArray().then(result => res.send(result));
    });
});


/* create a new group */
groupRouter.post('/', (req: any, res, next) => {
    const group: Group = {
        groupId: uuid(),
        name: req.body.name,
        created: new Date()
    }

    RethinkDbService.createTableIfItDoesNotExist('groups', req._rdb, {primary_key: 'groupId'}).then(() => {
        r.db(DB_NAME).table('groups').insert(group).run(req._rdb, (err, res2) => {
            if(err) throw err
    
            res.send(group)
        });
    });
});

export default groupRouter;