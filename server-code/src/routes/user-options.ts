import * as express from "express";
import * as r from 'rethinkdb';
import { DB_NAME } from "../config/database";
import { RethinkDbService } from "../services/rethink-db-service";
import { UserOptions, GroupSettings } from '@shared';
import { ApiError } from "../utils/error";
import { verifyGroupId } from "../middleware/verify-group-id";
import { MyStompServer } from "../utils/stomp-server";

const userOptionsRouter: express.Router = express.Router();


/* create a new group */
userOptionsRouter.post('/', verifyGroupId, (req: any, res, next) => {
    const stompServer = MyStompServer.get();

    // expects a user options body:
    const userOptions: UserOptions = req.body as UserOptions;

    if (!userOptions.groupId) {
        throw new ApiError('Group Id must be set', 401);
    }



    RethinkDbService.createTableIfItDoesNotExist('user_options', req._rdb, {primary_key: 'id'}).then(() => {
        r.db(DB_NAME).table('user_options').get(userOptions.id).replace(userOptions).run(req._rdb, (err, res2) => {
            if(err) throw err;

            console.log('successfully updated the user');

            r.db(DB_NAME).table('user_options').filter({groupId: userOptions.groupId}).run(req._rdb, (err, cursor) => {

                const groupSettings: GroupSettings = {
                    groupId: userOptions.groupId,
                    users: []
                };

                cursor.toArray((err, dbResult) => {
                    dbResult.forEach(user => {
                        groupSettings.users.push(user);
                    })
                    // 
                    console.log(groupSettings);
                    stompServer.send('/group/' + userOptions.groupId, {}, JSON.stringify(groupSettings));
                })
            })
        });
    });
});

export default userOptionsRouter;