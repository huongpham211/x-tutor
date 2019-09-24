import sessionModel from '../models/sessionModel';


class SessionService {
    //get all sessions of specified user
    getCalendar(userId){
        return sessionModel
            .find(
                // {$or: [{tutorId: userId}, {studentId: userId}]}
                {studentId: userId}
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
            .populate({
                path: 'comments',
                model: 'comment',
                populate: {
                    path: 'owner',
                    model: 'user',
                    select: 'username'
                }
            })
    }

    //create new session, this will used in pay of schedules controller
    createSession(session){
        return sessionModel
            .create(session)
    }


    //push comment to comments array in specified session
    comment(id, commentId){
        return sessionModel
            .findOneAndUpdate(
                {_id: id},
                {$push: {comments: commentId}},
                {new: true}
            )
    }

    //rate specified session
    rate(id, rate) {
        return sessionModel
            .findOneAndUpdate(
                {_id: id},
                {$set: rate},
                {new: true}
            )
    }

    //report specified session
    report(id, report) {
        return sessionModel
            .findOneAndUpdate(
                {_id: id},
                {$set: report},
            )
    }

    //change status of specified session
    status(id, status) {
        return sessionModel
            .findOneAndUpdate(
                {_id: id},
                {$set: status},
                {new: true}
            )
    }

    updateDocumentPath(id, path) {
        return sessionModel
            .findOneAndUpdate(
                {_id: id},
                {$push: {documents: path}},
                {new: true}
            )
    }
}


export default new SessionService()

