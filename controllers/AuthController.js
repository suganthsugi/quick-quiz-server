const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

// importing schema
const User = require('../models/User');
const OtpMap = require('../models/OtpMap');

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

function sendmail(otp, reciver) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'quickquizmoderator@gmail.com',
            pass: 'zbjyrnnkyzouwemm'
        }
    });

    var mailOptions = {
        from: 'quickquizmoderator@gmail.com',
        to: reciver,
        subject: 'OTP Verification for QuickQuiz',
        html: `<center><h1>Your OTP is <span style="background-color:rgb(153, 255, 204); color:black">${otp}</span>.</h1><br /><h2>Please don't share otp with anyone.<br />This otp will authomatically expires in 24hrs</h2></center>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
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
        
        const savedUser = await newUser.save();

        sendmail(otp, email);

        const hashedOtp = await bcrypt.hash(otp, 10);

        const newOtpMap = new OtpMap({
            email,
            otp:hashedOtp
        });

        const savedOtpMap = await newOtpMap.save()

        res.send('ok');

    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "Server Error",
                err: err.message
            }
        })
    }
}
