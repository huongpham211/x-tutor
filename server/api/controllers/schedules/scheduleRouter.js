import scheduleController from './scheduleController';
import * as express from 'express';


export default express
    .Router()
    .get('/:id', scheduleController.getById)
    .put('/:id', scheduleController.updateSchedule)
    .delete('/:id', scheduleController.deleteSchedule)
    .post('/:id/pay', scheduleController.paymentGate)
    .get('/:id/sessions', scheduleController.getAllSessions)