const mongoose = require('mongoose');

const QnSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    choices: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: Number,
        required: true
    },
    mark: {
        type: Number,
        default: 1
    },
    explaination: {
        type: String,
        default: "not found"
    },
    mode: {
        type: String,
        default: "medium"
    }
}, { timestamps: true });

const QnPaperSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        unique: true
    },
    categoryName: {
        type: String,
        required: true
    },
    questions: {
        type: [QnSchema],
        required: true
    },
    totalScore: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        default: "medium"
    }
}, { timestamps: true });

module.exports = mongoose.model('QnPaper', QnPaperSchema);
