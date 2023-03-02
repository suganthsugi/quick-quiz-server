const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// importing schema
const User = require('../models/User');

function generateOTP() {
    // Define all possible characters for the OTP
    const characters = '0123456789';

    let otp = '';

    // Loop through the characters to create a 6-digit OTP
    for (let i = 0; i < 6; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return otp;
}


exports.register = async (req, res) => {
    try {
        // getting values from the body
        const { email, phno, password, firstName, lastName } = req.body;
        console.log(email, phno, password, firstName, lastName);

        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // creating new user instace
        const newUser = new User({
            email,
            phno,
            password: hashedPassword,
            firstName,
            lastName
        });

        const otp = generateOTP();
        console.log(otp);

        res.send('ok');

    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "Server Error",
                err
            }
        })
    }
}
