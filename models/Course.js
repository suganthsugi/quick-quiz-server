const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);