import * as r from 'rethinkdb'
import { DB_HOST, DB_PORT, DB_NAME } from '../config/database';

export class RethinkDbService {

    public static connect2(): Promise<r.Connection> {
        return r.connect({host: DB_HOST, port: DB_PORT})
    }

    // public static connect(): r.Connection {
    //     let count = 0;
    //     let conn: r.Connection;

    //     ( function _connect() {
    //         r.connect({host: DB_HOST, port: DB_PORT}, ( error, connection ) => {
    //             if ( error && error.name === 'ReqlDriverError' && error.message.indexOf( 'Could not connect' ) === 0 && ++count < 31 ) {
    //                 console.log( error );
    //                 setTimeout( _connect, 1000 );
    //                 return;
    //             }

    //             console.log('connection to database established')
    //             conn = connection
    //         } );
    //     })();

    //     console.log('conn', conn);

    //     return conn;
    // }

    public static db(): r.Db {
        return r.db(DB_NAME);
    }
}