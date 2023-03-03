const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

// importing schema
const User = require('../models/User');
const OtpMap = require('../models/OtpMap');

const db = require('../db');

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
        // console.log(email, phno, password, firstName, lastName);

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
            phno,
            otp:hashedOtp
        });

        const savedOtpMap = await newOtpMap.save();
        console.log(User.find({email:email}), OtpMap.findOne({email:email}));
        res.status(200).json({
            status:"success",
            data:{
                message:"Successfully registered user",
                user: savedUser
            }
        })

    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "Server Error",
                err: err.message
            }
        });
        return;
    }
}


exports.verifyMail = async (req, res) => {
    const { email, otp } = req.body;

    const pendingUser = await OtpMap.findOne({email:email});

    if(pendingUser===null){
        res.status(400).json({
            status:"error",
            data:{
                message:"User not registered"
            }
        });
        return;
    }

    const ismatch = bcrypt.compare(otp, pendingUser.otp);

    if(!ismatch){
        res.status(400).json({
            status:"error",
            data:{
                message:"Otp doesn't match"
            }
        });
        return;
    }

    const currUser = await User.findOne({ email: email });

    if(currUser.isActive===true){
        res.status(201).json({
            status:"success",
            data:{
                message:"Alredy mail verified"
            }
        })
    }

    currUser.isActive = true;
    const savedUser = await currUser.save();

    console.log(savedUser);

    const jwt_token = jwt.sign({ user_id:savedUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(200).json({
        status:"success",
        data:{
            message:"user verified successfully",
            user:savedUser,
            jwt_token
        }
    });
}