import * as r from 'rethinkdb'
import { DB_HOST, DB_PORT, DB_NAME } from '../config/database.config';

export class RethinkDbService {

    public static connect(): Promise<r.Connection> {
        return r.connect({host: DB_HOST, port: DB_PORT})
    }

    public static db(): r.Db {
        return r.db(DB_NAME);
    }

    public static createTableIfItDoesNotExist(table: string, connection?: r.Connection, options?: r.TableOptions): Promise<r.CreateResult | null> {
        if(!connection) {
            RethinkDbService.connect().then(conn => {
                return this.createTableIfItDoesNotExist(table, conn, options)
            })
        } else {
            RethinkDbService.db().tableList().run(connection, (err, tables) => {
                if(tables.indexOf(table) === -1) {
                    console.log('create table ' + table)
                    return RethinkDbService.db().tableCreate(table, options).run(connection)
                } else {
                    return new Promise((resolve) => {
                        resolve()
                    });
                }
            })
        }
        return new Promise((resolve) => {
            resolve()
        });
    }
}