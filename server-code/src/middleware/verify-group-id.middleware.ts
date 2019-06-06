import { ApiError } from '../utils/error';
import { RethinkDbService } from '../services/rethink-db.service';

export function verifyGroupId( req, res, next ) {
    const groupId = req.headers['group-id'];

    if(!groupId) {
        throw new ApiError('No group id found in header', 401);
    }

    if(!RethinkDbService.db().table('groups').getAll(groupId).count().eq(1)) {
        throw new ApiError('Your group id is not valid', 401);
    }

    req._groupId = groupId;

    next()
};