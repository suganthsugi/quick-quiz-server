const mongoose = require('mongoose');

const otpMapSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    phno: {
        type: String,
        require: true,
        unique: true
    },
    otp: {
        type: String,
        require: true
    },
}, { timestamps: true })


module.exports = mongoose.model("OtpMap", otpMapSchema);