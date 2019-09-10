import UserController from './userController';
import * as express from 'express';
import multer from 'multer';
import * as path from 'path';
import Auth from '../../middlewares/auth'

//set the storage engine:
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('storage here')
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        console.log('file' + file)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        // cb(null, file.originalname)
    }
})

//upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        //allowed ext
        var fileTypes = /jpeg|jpg|gif|png/;
        //check ext
        var extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
        //check mime
        var mimeType = fileTypes.test(file.mimetype);

        if(mimeType && extName !== fileTypes) {
            return cb(null, true)
        } else cb('ERR. Image only!!!')
    }
})


export default express
    .Router()
    .get('/', UserController.getAllUser)
    .get('/all-tutors', UserController.getAllTutors)
    .get('/:id', UserController.getUserById)
    .put('/:id', Auth.validateToken, UserController.updateInfoUser)
    .patch('/password', Auth.validateToken, UserController.updatePassword)
    // .get('/:id/avatar', UserController.getAvatar)
    .patch('/:id/avatar', Auth.validateToken,  upload.single('avatar'), UserController.updateAvatar)
    .patch('/:id/tutor-intro', Auth.validateToken, UserController.updateTutorIntro)
    .patch('/:id/tutor-free-time', Auth.validateToken, UserController.updateTutorFreeTime)
    .patch('/:id/tutor-reference', Auth.validateToken, UserController.updateTutorRef)
    .patch('/:id/tutor-working-experience', Auth.validateToken, UserController.updateTutorExp)
    .patch('/:id/tutor-teaching-subject',Auth.validateToken, UserController.updateTutorCourse)
    .post('/:id/tuition-schedules', Auth.validateToken, UserController.createTuitionSchedule)
    .get('/:id/tuition-schedules', UserController.getAllSchedules)
    .get('/:id/calendar', UserController.getCalendar)