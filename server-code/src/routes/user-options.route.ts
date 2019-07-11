import * as express from "express";
import { RethinkDbService } from "../services/rethink-db.service";
import { UserOptions, GroupSettings } from '@shared';
import { ApiError } from "../utils/error";
import { verifyGroupId } from "../middleware/verify-group-id.middleware";
import { MyStompServer } from "../utils/stomp-server";
import { wrapAsync } from "../utils/wrap-async";

const userOptionsRouter: express.Router = express.Router();

async function broadcastToUsers(conn, groupId) {
    const stompServer = MyStompServer.get();
    const cursor = await RethinkDbService.db().table('user_options').filter({groupId: groupId}).run(conn);

    const groupSettings: GroupSettings = {
        groupId: groupId,
        users: []
    };

    const dbResult = await cursor.toArray();

    dbResult.forEach(user => {
        groupSettings.users.push(user);
    })
            
    stompServer.send('/group/' + groupId, {}, JSON.stringify(groupSettings));
}

userOptionsRouter.get('/hello/:userId', verifyGroupId, wrapAsync(async (req: any, res, next) => {
    // expects a user options body:
    const userid = req.params.userId;

    const userOptions: any = await RethinkDbService.db().table('user_options').get(userid).run(req._rdb);

    await broadcastToUsers(req._rdb, userOptions.groupId);

    res.send();
}));


/* send useroptions */
userOptionsRouter.post('/', verifyGroupId, wrapAsync(async (req: any, res, next) => {
    // expects a user options body:
    const userOptions: UserOptions = req.body as UserOptions;

    if (!userOptions.groupId) {
        throw new ApiError('Group Id must be set', 401);
    }

    await RethinkDbService.db().table('user_options').get(userOptions.id).replace(userOptions).run(req._rdb);

    await broadcastToUsers(req._rdb, userOptions.groupId);

    res.send();
}));

userOptionsRouter.delete('/:userId', wrapAsync(async (req: any, res) => {
    const result: any = await RethinkDbService.db().table('user_options').get(req.params.userId).delete({returnChanges: true}).run(req._rdb);
    const groupId = result.changes[0].old_val.groupId;

    await broadcastToUsers(req._rdb, groupId);

    res.send();
}));



export default userOptionsRouter;