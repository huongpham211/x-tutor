import userService from '../../services/userService';
import scheduleService from '../../services/scheduleService';
import * as body from 'body-parser';
import multer from 'multer';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import moment from 'moment';
import { deflateSync } from 'zlib';


class UserController {
    getAllUser(req, res) {
        userService
            .getAllUser()
            .then(allUser => {
                res.status(200).json({success: true, allUser})
            })
            .catch(err => res.status(500).json({success: false, err}))
    }


    getAllTutors(req, res) {
        userService
            .getAllTutor()
            .then(allTutor => {
                res.status(200).json({success: true, allTutor})
            })
            .catch(err => res.status(500).json({success: false, err}))
    }

    getUserById(req, res) {
        userService
            .getUserById(req.params.id)
            .then(userFound => {
                if(!userFound) res.status(404).json({success: false, message: 'User is not exist!!'});
                else {
                    res.status(200).json({success: true, userFound})
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({err})
            })
    }


    updateInfoUser(req, res) {
        console.log(req.decoded.ownerId)
        userService
            .getUserById(req.decoded.ownerId)
            .then(userFound =>{
                if(!userFound) res.status(403).json({success: false, message: 'Access is not allow'}).end()
                else {
                    for(let key in req.body){
                        let value = req.body[key];
                        if(value !== null) {
                            userFound[key] = value
                        }
                    }          
                    return userFound.save();
                }
            })
            .then(userUpdated =>{
                res.status(200).json({success: true, userUpdated});
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({err})
            });
    }


    updatePassword(req, res) {
        userService
            .getUserById(req.decoded.ownerId)
            .then(userFound =>{
                if(!userFound) res.status(403).json({success: false, message: 'Access is not allowed!!'})
                else {
                    console.log('oldPassword ' + req.body.oldPassword)
                    console.log('hashOldPassword ' + userFound.password)
                    bcrypt
                        .compare(req.body.oldPassword, userFound.password)
                        .then(match => {
                            if(match) {
                                console.log('newPass ' + req.body.newPassword);
                                userFound.password = req.body.newPassword;
                                return userFound.save()
                            } else res.status(401).json({success: false, message: 'Incorrect password!!!'})
                        })
                        .then(userUpdated => {
                            console.log(userUpdated)
                            res.status(200).json({success: true, message: 'Updated!!'})
                        })
                }
            })
            .catch(err =>{
                console.log(err)
                res.status(500).json(err)
            })
    }


    updateAvatar(req, res) {
        console.log(req.headers)
        console.log('updateAvatar ' + req.file)
        if(req.file){
            try {
                const path = `/uploads/${req.file.filename}`
                userService
                    .updateAvatarPath(req.params.id, path)
                    .then(userUpdated => {
                        return res.status(200).json({userUpdated, path})
                    })

            } catch(err) {
                return res.status(500).json({err})
            }
        } else {
            return res.status(403).json({success: false, message: 'No file seclected!!'})
        }
    }


    deleteUser(req, res) {
        userService
            .deleteUser(req.decoded.ownerId)
            .then(userActiveUpdated => {
                if(!userActiveUpdated) res.status(403).json({success: false, message: "Something went wrong"})
                else res.status(200).json({success: true, message: "Locked", userActiveUpdated})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json(err)
            })
    }


    updateTutorIntro(req, res) {
        userService
        .checkTutor(req.decoded.ownerId)
        .then(tutorFound => {
            if(!tutorFound) res.status(403).json({success: false, message: 'Access is not allowed!!!'})
            else {
                tutorFound.tutorData.aboutMe = req.body.aboutMe
                tutorFound.tutorData.hourlyRate = req.body.hourlyRate
                return tutorFound.save()
            }
        })
        .then(tutorUpdated => {
            res.status(200).json({success: true, tutorUpdated})
        })
        .catch(err => {
                console.log(err)
                res.status(500).json({err})
        })
    }


    updateTutorFreeTime(req, res) {
        userService
        .checkTutor(req.decoded.ownerId)
        .then(tutorFound => {
            if(!tutorFound) res.status(403).json({success: false, message: 'Access is not allowed!!!'})
            else {
                //return userService.updateFreeTime(req.decoded.ownerId, req.body)
                for(let key in req.body){
                    let value = req.body[key];
                    if(value !== null) {
                        tutorFound.tutorData[key] = value
                    }
                }          
                return tutorFound.save();
            }
        })
        .then(updated => res.status(200).json({success: true, message: 'Updated', updated}))
        .catch(err => {
            console.log(err)
            res.status(500).json({err})
        })
    }

    updateTutorRef(req, res) {
        console.log('ownerId '+ req.decoded.ownerId)
        userService
        .checkTutor(req.decoded.ownerId)
        .then(tutorFound => {
            if(!tutorFound) res.status(403).json({success: false, message: 'Access is not allowed!!!'})
            else {
                var education = req.body.education
                education.forEach(element => {
                    console.log(element)
                    var tutorEdu =  tutorFound.tutorData.education
                    tutorEdu.push(element)
                });
                return tutorFound.save()
            }
        })
        .then(tutorUpdated =>{
            res.status(200).json({success: true, message: 'Updated', tutorUpdated})
        } )
        .catch(err => {
            console.log(err)
            res.status(500).json({err})
        })
    }


    // updateTutorRef(req, res) {
    //     console.log(req.decoded.ownerId)
    //     userService
    //         .checkTutor(req.decodeobd.ownerId)
    //         .then(tutorFound => {
    //             if(!tutorFound) res.status(403).json({success: false, message: 'You are not Tutor!!!'})
    //             else {
    //                 var education = req.body.education
    //                 userService.updateTutorDataArray(req.decoded.ownerId, education)
    //             }
    //         })
    // }
    

    deleteTutorRefRow(req, res) {
    }


    updateTutorExp(req, res) {
        //Tutor Working Experience
        console.log('ownerId '+ req.decoded.ownerId)
        userService
        .checkTutor(req.decoded.ownerId)
        .then(tutorFound => {
            if(!tutorFound) res.status(403).json({success: false, message: 'Access is not allowed!!!'})
            else {
                var workingExperience = req.body.workingExperience
                workingExperience.forEach(element => {
                    console.log(element)
                    var tutorExp =  tutorFound.tutorData.workingExperience
                    tutorExp.push(element)
                });                
                return tutorFound.save()
            }
        })
        .then(tutorUpdated =>{
            res.status(200).json({success: true, message: 'Updated', tutorUpdated})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({err})
        })
    }


    updateTutorCourse(req, res) {
        //Tutor teaching subject
        console.log('ownerId '+ req.decoded.ownerId)
        userService
        .checkTutor(req.decoded.ownerId)
        .then(tutorFound => {
            if(!tutorFound) res.status(403).json({success: false, message: 'Access is not allowed!!!'})
            else {
                tutorFound.tutorData.basedIn = req.body.basedIn
                var teachingSubject= req.body.teachingSubject
                teachingSubject.forEach(element => {
                    console.log(element)
                    var tutorSbj =  tutorFound.tutorData.teachingSubject
                    tutorSbj.push(element)
                });
                return tutorFound.save()
            }
        })
        .then(tutorUpdated =>{
            res.status(200).json({success: true, message: 'Updated', tutorUpdated})
        } )
        .catch(err => {
            console.log(err)
            res.status(500).json({err})
        })
    }


    createTuitionSchedule(req, res) {
        userService
            .checkTutor(req.params.id)
            .then(tutorFound => {
                if(!tutorFound) res.status(403).json({success: false, message: 'This tutor is not exists'})
                else{
                    return tutorFound
                }
            })
            .then(tutorFound => {
                const tuiSchedule = req.body;

                /** calculate: time*/
                tuiSchedule.hourEnd = req.body.hourStart + req.body.hoursPerLession
                
                //this is tutor's hourStart
                var hStart = tutorFound.tutorData.hourStart
                var hEnd = tutorFound.tutorData.hourEnd
                console.log('tutor hourStart ' + hStart)
                console.log('tutor hourEnd ' + hEnd)

                //these are day in tutor's free time
                var start = moment(tutorFound.tutorData.periodeStart).format('YYYY-MM-DD');
                var end = moment(tutorFound.tutorData.periodeEnd).format('YYYY-MM-DD');                
                // console.log('tutorStart ' + start)
                // console.log('tutorEnd ' + end)

                //these are student's prefer day
                var dS = moment(tuiSchedule.periodeStart).format('YYYY-MM-DD');
                var dE = moment(tuiSchedule.periodeEnd).format('YYYY-MM-DD');
                //console.log('dS ' + dS)
                //console.log('dE ' + dE)

                //compare student's prefer time - tutor's free time
                if(!moment(dS).isBetween(start, end, null, '[]') && !moment(dE).isBetween(start, end, null, '[]')) {
                    res.status(403).json({success: false, message: "Pick start and end date between tutor's free time"})
                } else if (!between(tuiSchedule.hourStart, hStart, hEnd) || !(tuiSchedule.hourEnd, hStart, hEnd)){
                    res.status(403).json({success: false, message: "Pick start and end hours between tutor's free time"})
                } else {
                    /** change time zone*/

                    /** calculate: période */
                    tuiSchedule.sessions = []
                    for(var m = moment(tuiSchedule.periodeStart); m.isBefore(tuiSchedule.periodeEnd); m.add(1, 'days')) {
                        // console.log(m.format('YYYY-MM-DD'));
                        tuiSchedule.preferDay.forEach(day => {
                            // console.log(day)
                            if (m.format('dddd') == day) {
                                // console.log(m.format('YYYY-MM-DD'))
                                // console.log(day)
                                tuiSchedule.sessions.push(m.format('YYYY-MM-DD'))
                            }
                        })
                    }

                    /** calculate lessionsPerCourse*/
                    tuiSchedule.lessionsPerCourse = tuiSchedule.sessions.length

                    /** calculate:  total fee */
                    tuiSchedule.feePerHour = tutorFound.tutorData.hourlyRate
                    console.log('type of feePerHour '+ typeof tuiSchedule.feePerHour)
                    console.log('type of hourPerLession '+typeof tuiSchedule.hoursPerLession)
                    console.log('type of lessionPerCourse '+typeof tuiSchedule.lessionsPerCourse)
                    tuiSchedule.feeTotal = tuiSchedule.feePerHour*tuiSchedule.hoursPerLession*tuiSchedule.lessionsPerCourse
                    
                    /** set senderId & tutorId */
                    tuiSchedule.senderId = req.decoded.ownerId
                    tuiSchedule.tutorId = req.params.id

                    /** set courseCode */
                    tuiSchedule.courseCode = req.body.academicLevel.slice(0,2) +'-' + req.decoded.username + '-' + tutorFound.username
                    
                    
                    console.log(tuiSchedule)
                    // return "OK"
                    return scheduleService.createNewSchedule(tuiSchedule)
                }
            })
            .then(scheduleCreated => {
                console.log(scheduleCreated)
                res.status(200).json({success: true, scheduleCreated})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: "Something went wrong!!!", err})
            })
        
        //small method
        function between(x, min, max) {
            if(x >= min && x <= max) return true
            else return false
        }
    
    }

    
    getAllSchedules(req, res){
        scheduleService
            .getAllSchedule(req.params.id)
            .then(allSchedules => {
                res.status(200).json({success: true, allSchedules})
            })
            .catch(err => res.status(500).json({success: false, message: 'Something went wrong!!!', err}))
    }


    // getCalendar(req, res) {
    //     userService

    // }

    
}


export default new UserController()