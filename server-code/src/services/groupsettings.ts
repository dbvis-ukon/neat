import { RethinkDbService } from './rethink-db-service';

export class GroupSettingsService {


    public static listenForChangesAndBroadcast() {
        RethinkDbService.connect().then(conn => {
            RethinkDbService.createTableIfItDoesNotExist('groupsettings', conn, {primary_key: 'groupId'}).then(() => {
                RethinkDbService.db().table('groupsettings')
                .changes()
                .run(conn, (err, cursor) => {
                    if(cursor) {
                        console.log('attached listener to table groupsettings')
                        cursor.each(console.log)
                    }
                }) 
            })
        })
    }
}