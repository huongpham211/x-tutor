import userService from '../../services/userService';
import scheduleService from '../../services/scheduleService';
import * as body from 'body-parser';
import multer from 'multer';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';


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


    // updateTutorRef(req, res) {
    //     console.log('ownerId '+ req.decoded.ownerId)
    //     userService
    //     .checkTutor(req.decoded.ownerId)
    //     .then(tutorFound => {
    //         if(!tutorFound) res.status(403).json({success: false, message: 'Access is not allowed!!!'})
    //         else {
    //             var education = req.body.education
    //             education.forEach(element => {
    //                 console.log(element)
    //                 var tutorEdu =  tutorFound.tutorData.education
    //                 tutorEdu.push(element)
    //             });
    //             return tutorFound.save()
    //         }
    //     })
    //     .then(tutorUpdated =>{
    //         res.status(200).json({success: true, message: 'Updated', tutorUpdated})
    //     } )
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json({err})
    //     })
    // }


    updateTutorRef(req, res) {
        userService
            .checkTutor(req.decoded.ownerId)
    }
    

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
        const tuiSchedule = req.body;  

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date(tuiSchedule.periodeStart);
        var dayName = days[d.getDay()];
        // console.log(tuiSchedule.preferDay[0])
        // console.log(dayName)
        userService
            .checkTutor(req.params.id)
            .then(tutorFound => {
                if(!tutorFound) res.status(403).json({success: false, message: 'This tutor is not exist!!'})
                else if(dayName !== tuiSchedule.preferDay[0]) {
                    res.status(401).json({success: false, message: 'Please choose Start Date match for prefer day'})
                }
                else{
                    /** change time zone to 7*/
                        
                    // var d = new Date(req.body.periodeStart);
                    // var offset = (new Date().getTimezoneOffset() / 60) * - 1;
                    // console.log("offset " + offset)
                    // tuiSchedule.periodeStart = new Date(d.getTime() + offset*60*60);
                    /** calculator total fee */
                        
                    tuiSchedule.feePerHour = tutorFound.tutorData.hourlyRate
                    console.log('type of feePerHour '+ typeof tuiSchedule.feePerHour)
                    console.log('type of hourPerLession '+typeof tuiSchedule.hoursPerLession)
                    console.log('type of lessionPerCourse '+typeof tuiSchedule.lessionsPerCourse)
                    tuiSchedule.feeTotal = tuiSchedule.feePerHour*tuiSchedule.hoursPerLession*tuiSchedule.lessionsPerCourse
                    /** set senderId & tutorId */
                    tuiSchedule.senderId = req.decoded.ownerId
                    tuiSchedule.tutorId = req.params.id
                    /** set courseCode */
                        
                    tuiSchedule.courseCode = req.body.academicLevel +'-' + req.decoded.username
                    /** calculator date time*/
                        
                    tuiSchedule.hourEnd = req.body.hourStart + req.body.hoursPerLession
                    /** set periodeEnd*/
                        
                    tuiSchedule.periodeEnd = '2019-10-10'
                    
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
    }

    
    getAllSchedules(req, res){
        scheduleService
            .getAllSchedule(req.params.id)
            .then(allSchedules => {
                res.status(200).json({success: true, allSchedules})
            })
            .catch(err => res.status(500).json({success: false, message: 'Something went wrong!!!', err}))
    }

    
}


export default new UserController()