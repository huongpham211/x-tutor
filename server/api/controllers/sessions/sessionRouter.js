import sessionController from './sessionController';
import * as express from 'express';
import multer from 'multer';
import path from 'path';


//set the storage engine:
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/documents')
    },
    filename: function(req, fle, cb){
        cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
    }
})

//upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        TODO //ext name
    }
})

export default express
    .Router()
    .get('/:id', sessionController.getSessionById)
    // .delete('/:id', sessionController)
    .patch('/:id/rate', sessionController.rateSession)
    .patch('/:id/report', sessionController.rateSession)
    .patch('/:id/')