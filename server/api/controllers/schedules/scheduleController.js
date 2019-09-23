import scheduleService from '../../services/scheduleService';
import sessionService from '../../services/sessionService'
import * as body from 'body-parser';


class ScheduleController {
    getById(req, res) {
        scheduleService
            .getScheduleById(req.params.id)
            .then(tuiSchedule => {
                if(!tuiSchedule) res.status(404).json({success: false, message: 'This tuition schedule is not exist!!'})
                else{
                    res.status(200).json({success: true, tuiSchedule})
                }
            })
            .catch(err => res.status(500).json({success: false, err}))
    }

    updateSchedule(req, res) {
        scheduleService
            .updateSchedule(req.params.id, req.body)
            .then(tuiSchedule => {
                if(!tuiSchedule) res.status(404).json({success: false, message: 'This tuition schedule is not exist!!'})
                else{
                    //calculator total fee
                    console.log(typeof tuiSchedule.feePerHour)
                    console.log(typeof tuiSchedule.hoursPerLession)
                    console.log(typeof tuiSchedule.lessionsPerCourse)
                    tuiSchedule.feeTotal = tuiSchedule.feePerHour*tuiSchedule.hoursPerLession*tuiSchedule.lessionsPerCourse
                    //calculator date time
                    tuiSchedule.hourEnd = tuiSchedule.hourStart + tuiSchedule.hoursPerLession
                    //set periodeEnd
                    tuiSchedule.periodeEnd = '2019-10-10'
                    console.log(tuiSchedule)

                    return tuiSchedule.save()
                }
            })
            .then(updated => {
                res.status(200).json({success: true, updated})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({success: false, err})
            })
    }
    

    deleteSchedule(req, res) {
        scheduleService
            .deleteSchedule(req.params.id)
            .then(res.status(200).json({success: true, message: "deleted!"}))
            .catch(err => res.status(500).json({success: false, err}))
    }

    //this isn't a real paymentGate, just demo
    paymentGate(req, res) {
        const statusObj = {};
        statusObj.paymentStatus = 'Completed';
        statusObj.tuitionStatus = 'In Progress';
        statusObj.paymentDate = Date.now();
        scheduleService
            .updateScheduleStatus(req.params.id, statusObj)
            .then(schUpdated => {
                if(schUpdated) {
                    return res.status(200).json({success: true, message: "Thanks for your donation!!!", schUpdated})
                }
                else res.status(403).json({success: false, message: 'This tuition schedule not exist!!'})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({err, message: "something went wrong!!!"})
            })


    }

    getAllSessions(req,res) {
        sessionService
            .getAllSession(req.params.id)
            .then(sessions =>{
                res.status(200).json({success: true, sessions})
            })
    }
} 


export default new ScheduleController()