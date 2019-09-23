import commentModel from '../models/commentModel';

class CommentService {    
    //create new comment in specified session
    createComment(comment) {
        return commentModel
            .create(comment)
    }
}

export default new CommentService()