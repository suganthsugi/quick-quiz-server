const mongoose = require('mongoose');

const scripts=new mongoose.Schema({
    answers:[],
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
    qnName:{
    type:String,
    required:true
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
    },
    rating:{
        
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Answers",scripts)