const mongoose = require('mongoose');
const practiceSchema=new mongoose.Schema({
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
    },
    timeTaken: {
        type: Number,
        required: true,
        default:"0"
    }
}, { timestamps: true })
const testSchema=new mongoose.Schema({
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
    },
    timeTaken: {
        type: Number,
        required: true,
        default:"0"
    }
}, { timestamps: true })
const statsSchema = new mongoose.Schema({
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
    },
    rating:{
        type:Number,
        default:0,
    }
  });
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
    pratice:[practiceSchema],
    test:[testSchema],
    stats: {
        type: statsSchema,
    }
}, { timestamps: true })


module.exports = mongoose.model("User", userSchema);