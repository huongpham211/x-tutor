import mongoose from "mongoose";
const Schema = mongoose.Schema;


const sessionModel = new Schema({
    nameOfSession: {type: String},
    scheduleId: {type: Schema.Types.ObjectId, ref: 'schedule'},
    studentId: {type: Schema.Types.ObjectId, ref: 'user'},
    tutorId: {type: Schema.Types.ObjectId, ref: 'user'},
    status: {type: String, enum: ['Not Started', 'Completed', 'Cancelled', 'Deferred']},
    rateStar: {type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0},
    rateComment: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
    documents: {type: Array},
    reportIssue: {type: String, enum: ['Late', 'Absent', 'Left early', 'Technical Dificultly', 'Others']},
    reportComment: {Type: String},
    isReported: {type: Boolean, default: 'false'},
    startDate: {type: Date},
    endDate: {type: Date}
})


module.exports = mongoose.model('session', sessionModel)