import sessionService from '../../services/sessionService';
import * as body from 'body-parser';


class SessionController {
    getSessionById(req, res) {
        sessionService
            .getSessionById(req.params.id)
            .then(session => res.status(200).json({success: true, session}))
            .catch(err => {
                console.log(err)
                res.status(500).json({success: false, message: 'Something went wrong'})
            })
    }


    comment(req, res) {
        sessionService
            .comment(req.params.id, req.params.body)
            .then(updated => {
                res.status(200).json({success: true, updated})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({success: false, message: 'Something went wrong!!'})
            })
    }

    uploadDocument(req, res) {
        
    }


    rateSession(req, res) {
        console.log(req.body)
        sessionService
            .rate(req.params.id, req.body)
            .then(updated => {
                if(updated) res.status(200).json({success: true, updated})
                else res.status(403).json({success: false, message: 'This session is not exist'})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({success: false, message: 'Something went wrong'})
            })
    }

    reportSession(req, res) {
        req.body.isReported = true
        sessionService
            .report(req.params.id, req.body)
            .then(updated => {
                if(updated) res.status(200).json({success: true, updated})
                else res.status(403).json({success: false, message: 'This session is not exist'})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({success: false, message: 'Something went wrong'})
            })            
    }

    

}


export default new SessionController()