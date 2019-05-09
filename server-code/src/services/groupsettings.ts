import { RethinkDbService } from './rethink-db-service';

export class GroupSettingsService {


    public static listenForChangesAndBroadcast() {
        RethinkDbService.connect2().then(conn => {
            RethinkDbService.db().tableList().run(conn, (err, tables) => {
                if(tables.indexOf('groupsettings') === -1) {
                    RethinkDbService.db().tableCreate('groupsettings', {primary_key: 'groupId'}).run(conn)
                }
            })
            
            
            RethinkDbService.db().table('groupsettings')
                .changes()
                .run(conn, (err, cursor) => {
                    cursor.each(console.log)
                })    
        })
    }
}