import ScheduleModel from '../models/scheduleModel';


class ScheduleService {
    getAllSchedule(userId) {
        return ScheduleModel
            .find({
                $or: [{tutorId: userId}, {senderId: userId}]
            })
    }


    getScheduleById(id) {
        return ScheduleModel
            .findById(id)
    }


    createNewSchedule(tuitionSchedule){
        return ScheduleModel
            .create(tuitionSchedule)
    }


    updateSessionArray(id, value) {
        return ScheduleModel
            .findByIdAndUpdate(id, {$push: {'sessions': value}})
    }


    updateSchedule(id, tuiSchedule){
        return ScheduleModel
            .findByIdAndUpdate(id, tuiSchedule, {new: true})
    }

    deleteSchedule(id) {
        return ScheduleModel
            .remove({_id: id})
    }


    updateScheduleStatus(id, statusObj) {
        return ScheduleModel
            .findByIdAndUpdate(id, {$set: statusObj}, {new: true})
    }
 }


 export default new ScheduleService()