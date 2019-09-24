import sessionService from '../../services/sessionService';
import commentService from '../../services/commentService';
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
        var comment = req.body
        comment.owner = req.decoded.ownerId
        console.log(comment)
        commentService
            .createComment(comment)
            .then(comment => {
                return sessionService.comment(req.params.id,comment._id)
            })
            .then(updated => {
                res.status(200).json({success: true, updated})
            })
            .catch(err => res.status(500).json({success: false, message: 'Something went wrong!'}))
    }

    uploadDocument(req, res) {
        console.log(req.headers)
        console.log(req.file)
        if(req.file) {
            try{
                const path = `/documents/${req.file.filename}`
                sessionService
                    .updateDocumentPath(req.params.id, path)
                    .then(updated => {
                        return res.status(200).json({updated, path})
                    })
            } catch(err) {
                return res.status(500).json({err})
            }
        } else {
            return res.status(403).json({success: false, message: 'No file selected!!'})
        }
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

    
    updateStatus(req, res) {
        sessionService
            .status(req.params.id, req.body)
            .then(updated => {
                if(!updated) res.status(403).json({success: false, message: 'This session is not exist'})
                else res.status(200).json({success: true, updated})
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({success: false, message: 'Something went wrong'})
            })
    }

}


export default new SessionController()