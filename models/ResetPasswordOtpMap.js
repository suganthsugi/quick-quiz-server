const mongoose = require('mongoose');

const resetPasswordOtpMapSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    otp: {
        type: String,
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


module.exports = mongoose.model("ResetPasswordOtpMap", resetPasswordOtpMapSchema);