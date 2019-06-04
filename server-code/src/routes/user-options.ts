import * as express from "express";
import * as r from 'rethinkdb';
import { DB_NAME } from "../config/database";
import { RethinkDbService } from "../services/rethink-db-service";
import { UserOptions, GroupSettings } from '@shared';
import { ApiError } from "../utils/error";
import { verifyGroupId } from "../middleware/verify-group-id";
import { MyStompServer } from "../utils/stomp-server";

const userOptionsRouter: express.Router = express.Router();

function broadcastToUsers(conn, groupId) {
    const stompServer = MyStompServer.get();
    r.db(DB_NAME).table('user_options').filter({groupId: groupId}).run(conn, (err, cursor) => {

        const groupSettings: GroupSettings = {
            groupId: groupId,
            users: []
        };

        cursor.toArray((err, dbResult) => {
            dbResult.forEach(user => {
                groupSettings.users.push(user);
            })
            // 
            stompServer.send('/group/' + groupId, {}, JSON.stringify(groupSettings));
        })
    })
}


/* create a new group */
userOptionsRouter.post('/', verifyGroupId, (req: any, res, next) => {
    // expects a user options body:
    const userOptions: UserOptions = req.body as UserOptions;

    if (!userOptions.groupId) {
        throw new ApiError('Group Id must be set', 401);
    }



    RethinkDbService.createTableIfItDoesNotExist('user_options', req._rdb, {primary_key: 'id'}).then(() => {
        r.db(DB_NAME).table('user_options').get(userOptions.id).replace(userOptions).run(req._rdb, (err, res2) => {
            if(err) throw err;

            broadcastToUsers(req._rdb, userOptions.groupId);

            res.send();
        });
    });
});

userOptionsRouter.delete('/:userId', (req: any, res) => {
    r.db(DB_NAME).table('user_options').get(req.params.userId).delete({returnChanges: true}).run(req._rdb, (err, result: any) => {
        if(err) throw err;
        const groupId = result.changes[0].old_val.groupId;

        broadcastToUsers(req._rdb, groupId);

        res.send();
    });
});

export default userOptionsRouter;