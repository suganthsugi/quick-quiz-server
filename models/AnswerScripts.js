const mongoose = require('mongoose');

const scripts=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    qnPaper: {
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'QnPaper',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    totalquestions: {
        type: Number,
        required: true
    },
    correctanswers: {
        type: Number,
        required: true
    },
    totalscore: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Answers",scripts)