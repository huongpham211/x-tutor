import sessionModel from '../models/sessionModel';


class SessionService {
    //get all sessions of specified user
    getCalendar(userId){
        return sessionModel
            .find(
                {$or: [{tutorId: userId}, {senderId: userId}]}
            )
    }

    //fetch all sessions of specified tuition schedule
    getAllSession(scheduleId){
        return sessionModel
            .find({
                scheduleId
            })
    }

    //fetch to specified session
    getSessionById(id){
        return sessionModel
            .findOne(
                {_id: id}
            )
    }

    //
}

