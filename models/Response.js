const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
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
    score: {
        type: Number,
        required: true
    },
    attemptNumber: {
        type: Number,
        required: true,
        default: 1,
        unique: true
    },
    timeTaken: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true,
        default: "---___---___---"
    }
}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);