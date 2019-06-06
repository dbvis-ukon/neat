import { RethinkDbService } from '../services/rethink-db.service';

export function connect( req, res, next ) {
    req._rdb = RethinkDbService.connect().then(conn => {

        req._rdb = conn
        next()
    })
    .catch(reason => {
        console.error('could not connect to database', reason);
        next()
    })
};

export function close( req, res, next) {
    req._rdb.close();
    next();
};