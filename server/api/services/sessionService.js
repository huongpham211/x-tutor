import sessionModel from '../models/sessionModel';


class SessionService {
    //get all sessions of specified user
    getCalendar(userId){
        return sessionModel
            .find(
                {$or: [{tutorId: userId}, {studentId: userId}]}
            )
            .select('nameOfSession scheduleId studentId tutorId status date')
            .populate('scheduleId', 'hourStart hourEnd courseCode')
    }

    //fetch all sessions of specified tuition schedule
    getAllSession(scheduleId){
        return sessionModel
            .find({
                scheduleId
            })
            // .select('date')
            .populate('scheduleId', 'hourStart hourEnd courseCode')
    }

    //fetch to specified session
    getSessionById(id){
        return sessionModel
            .findOne(
                {_id: id}
            )
    }

    //create new session, this will used in pay of schedules controller
    createSession(session){
        return sessionModel
            .create(session)
    }
}


export default new SessionService()

