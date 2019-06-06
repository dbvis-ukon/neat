import { ApiError } from '../utils/error';
import { RethinkDbService } from '../services/rethink-db.service';

export function verifyGroupId( req, res, next ) {
    const groupId = req.headers['group-id'];

    if(!groupId) {
        const err = new ApiError('No group id found in header', 401);
        err.status = 401;
        next(err);
    }

    if(!RethinkDbService.db().table('groups').getAll(groupId).count().eq(1)) {
        const err = new ApiError('Your group id is not valid', 401);
        err.status = 401;
        next(err);
    }

    req._groupId = groupId;

    next()
};