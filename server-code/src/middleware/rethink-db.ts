import { RethinkDbService } from '../services/rethink-db-service';

export function connect( req, res, next ) {
    req._rdb = RethinkDbService.connect2().then(conn => {

        req._rdb = conn
        next()
    })
};

export function close( req, res, next) {
    req._rdb.close();
    next();
};