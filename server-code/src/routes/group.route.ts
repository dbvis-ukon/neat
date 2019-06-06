import * as express from "express";
import * as uuid from 'uuid/v4';
import { RethinkDbService } from "../services/rethink-db.service";
import { Group } from '@shared';
import { ApiError } from "../utils/error";
import { wrapAsync } from "../utils/wrap-async";

const groupRouter: express.Router = express.Router();

/**
 * List all groups
 */
groupRouter.get('/', wrapAsync(async (req: any, res, next) => {
    const cursor = await RethinkDbService.db().table('groups').run(req._rdb);

    const dbResult = await cursor.toArray();

    res.send(dbResult);
}));

/**
 * Return a specific group
 */
groupRouter.get('/:groupId', wrapAsync(async (req: any, res) => {
    console.log('get group', req.params.groupId);
    
    const group = await RethinkDbService.db().table('groups').get(req.params.groupId).run(req._rdb);

    if(group === null) {
        throw new ApiError('Group ' + req.params.groupId + ' could not be found', 404);
    }

    res.send(group);
}));

/**
 * Return all users in a group
 */
groupRouter.get('/:groupId/users', wrapAsync(async (req: any, res) => {
    console.log('show users of ', req.params.groupId)
    const cursor = await RethinkDbService.db().table('user_options').filter({groupId: req.params.groupId}).run(req._rdb);

    const result = await cursor.toArray();

    res.send(result);
}));


/**
 * Create a new group
 */
groupRouter.post('/', wrapAsync(async (req: any, res, next) => {
    const group: Group = {
        groupId: uuid(),
        name: req.body.name,
        created: new Date()
    }

    await RethinkDbService.db().table('groups').insert(group).run(req._rdb);
        

    res.send(group);
}));

export default groupRouter;