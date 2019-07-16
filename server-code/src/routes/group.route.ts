import * as express from "express";
import * as uuid from 'uuid/v4';
import { RethinkDbService } from "../services/rethink-db.service";
import { Group, UserOptions } from '@shared';
import { ApiError } from "../utils/error";
import { wrapAsync } from "../utils/wrap-async";
import { Connection } from "rethinkdb";

const groupRouter: express.Router = express.Router();

async function getPeopleOfGroup(groupId: string, connection: Connection): Promise<UserOptions[]> {
    const cursor = await RethinkDbService.db().table('user_options').filter({groupId}).run(connection);
    const people = await cursor.toArray();
    return people;
}

/**
 * List all groups
 */
groupRouter.get('/', wrapAsync(async (req: any, res, next) => {
    const cursor = await RethinkDbService.db().table('groups').run(req._rdb);
    

    const groups: Group[] = await cursor.toArray();

    const dbResultPromise = groups.map(async group => {
        const people = await getPeopleOfGroup(group.groupId, req._rdb);
        return {
            ... group,
            size: people.length
        };
    });

    const dbResult = await Promise.all(dbResultPromise);

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
 * Delete a specific group
 */
groupRouter.delete('/:groupId', wrapAsync(async (req: any, res) => {
    
    const group: Group = await RethinkDbService.db().table('groups').get(req.params.groupId).run(req._rdb) as Group;

    if(group === null) {
        throw new ApiError('Group ' + req.params.groupId + ' could not be found', 404);
    }

    const people = await getPeopleOfGroup(group.groupId, req._rdb);

    if(people.length > 0) {
        throw new ApiError('Group ' + group.name + ' is not empty', 400);
    }

    await RethinkDbService.db().table('groups').get(group.groupId).delete({returnChanges: true}).run(req._rdb);

    res.send();
}));

/**
 * Return all users in a group
 */
groupRouter.get('/:groupId/users', wrapAsync(async (req: any, res) => {
    const result = await getPeopleOfGroup(req.params.groupId, req._rdb);

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