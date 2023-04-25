const mongoose = require('mongoose');
const practiceSchema=new mongoose.Schema({
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
}, { timestamps: true })
const testSchema=new mongoose.Schema({
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
    qnName: {
        type: String,
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
    },
    rating:{
        
        type: Number,
        required: true
    }
}, { timestamps: true })

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phno: {
        type: String,
        require: true,
        unique: true
    },
    firstName: {
        type: String,
        require: false,
        default: "philips"
    },
    lastName: {
        type: String,
        require: false,
        default: "User"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    practice:[practiceSchema],
    test:[testSchema],
    lastLogin:{
        type:Date,
        default:Date.now,
        require:true
    },
    Rating:{
        type:Number,
        require:true,
        default:0
    },
    easy: {
        type: Number,
        default: 0,
      },
      medium: {
        type: Number,
        default: 0,
      },
      hard: {
        type: Number,
        default: 0,
      }
}, { timestamps: true })


module.exports = mongoose.model("User", userSchema);