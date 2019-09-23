import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const CommentModel = new Schema({
    comment: {type: String},
    username: {type: String}
})


module.exports = mongoose.model('comment', CommentModel)