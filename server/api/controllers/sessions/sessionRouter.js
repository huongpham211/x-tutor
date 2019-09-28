import sessionController from './sessionController';
import * as express from 'express';
import multer from 'multer';
import path from 'path';


//set the storage engine:
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/documents')
    },
    filename: function(req, file, cb){
        cb(null,Date.now() + '-' +  file.originalname)
    }
})

//upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 20971520} //20 MB
})


export default express
    .Router()
    .get('/:id', sessionController.getSessionById)
    .patch('/:id/rate', sessionController.rateSession)
    .patch('/:id/report', sessionController.rateSession)
    .patch('/:id/comment', sessionController.comment)
    .patch('/:id/status', sessionController.updateStatus)
    .patch('/:id/document', upload.single('document'), sessionController.uploadDocument)