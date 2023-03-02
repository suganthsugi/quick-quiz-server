const mongoose = require('mongoose');

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
    }
}, { timestamps: true })


module.exports = mongoose.model("User", userSchema);