import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const CommentModel = new Schema({
    comment: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: 'user'},
})


module.exports = mongoose.model('comment', CommentModel)