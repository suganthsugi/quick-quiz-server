const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

// importing schema
const User = require('../models/User');
const OtpMap = require('../models/OtpMap');
const ResetPasswordOtpMap = require('../models/ResetPasswordOtpMap');

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

function sendmail(reciver, content) {
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
        html: content
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

        if (email === undefined || phno === undefined || password === undefined || firstName === undefined || lastName === undefined) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "data missing"
                }
            });
            return;
        }

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

        sendmail(email, `<center><h1>Your OTP for mail verification is <span style="background-color:rgb(153, 255, 204); color:black">${otp}</span>.</h1><br /><h2>Please don't share otp with anyone.<br />This otp will authomatically expires in 24hrs</h2></center>`);

        const hashedOtp = await bcrypt.hash(otp, 10);

        const newOtpMap = new OtpMap({
            email,
            phno,
            otp: hashedOtp
        });

        const savedOtpMap = await newOtpMap.save();
        // console.log(User.find({ email: email }), OtpMap.findOne({ email: email }));
        res.status(200).json({
            status: "success",
            data: {
                message: "Successfully registered user",
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
    try {
        const { email, otp } = req.body;

        if (email === undefined || otp === undefined) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "data missing"
                }
            });
            return;
        }

        const currUser = await User.findOne({ email: email });

        if (currUser.isActive === true) {
            res.status(201).json({
                status: "success",
                data: {
                    message: "Alredy mail verified"
                }
            });
            return;
        }

        const pendingUser = await OtpMap.findOne({ email: email });


        const timestamp = new Date(pendingUser.createdAt).getTime();
        const now = Date.now();

        const diffSeconds = Math.floor((now - timestamp) / 1000);

        console.log(diffSeconds);
        if (diffSeconds > 300) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Otp expired"
                }
            });
            return;
        }

        const ismatch = await bcrypt.compare(otp, pendingUser.otp);
        console.log(otp, pendingUser.otp, ismatch);
        if (ismatch !== true) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Otp doesn't match"
                }
            });
            return;
        }



        currUser.isActive = true;
        const savedUser = await currUser.save();

        if (savedUser === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Unable to activate user",
                    error: "Server error"
                }
            });
            return;
        }

        await OtpMap.deleteOne({ email: email });

        const jwt_token = jwt.sign({ user_id: savedUser._id }, "suganth_suganthjayanthi-ragulv-kameswaranvs-vsubashvsubash_subash", { expiresIn: '7d' });

        res.status(200).json({
            status: "success",
            data: {
                message: "user verified successfully",
                user: savedUser,
                jwt_token
            }
        });
        return;

    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "Something went wrong",
                err: err.message
            }
        });
        return;
    }
}


exports.login = async (req, res) => {
    try {
        const { user, password } = req.body;

        if (user === undefined || password === undefined) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "data missing"
                }
            });
            return;
        }

        const currUser = await User.findOne({ $or: [{ email: user }, { phno: user }] });

        if (currUser === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "No user with given email/phno"
                }
            });
            return;
        }

        if (currUser.isActive === false) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Mail not verified, Please check mail and verify mail to loin..."
                }
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, currUser.password);

        if (passwordMatch === true) {
            const jwt_token = jwt.sign({ user_id: currUser._id }, "suganth_suganthjayanthi-ragulv-kameswaranvs-vsubashvsubash_subash", { expiresIn: "7d" });
            res.status(200).json({
                status: "success",
                data: {
                    message: "Successfully loggedin",
                    jwt_token
                }
            });
            return;
        }
        else {
            res.status(400).json({
                status: "error",
                data: {
                    message: "password dosen't match"
                }
            });
            return;
        }
    } catch (err) {
        res.status(400).json({
            status: "error",
            data: {
                message: "Internal server error",
                err: err.message
            }
        });
        return;
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const tempRP = ResetPasswordOtpMap.findOne({ email: email });
        if (tempRP !== null) {
            await ResetPasswordOtpMap.deleteOne({ email: email });
        }

        const currUser = await User.findOne({ email: email });

        if (currUser === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "user dosen't exsists",
                }
            });
            return;
        }

        if (currUser.isActive === false) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Please verify the email to continue...",
                }
            });
            return;
        }

        const otp = generateOTP();

        const hashedOtp = await bcrypt.hash(otp, 10);

        const newrpom = new ResetPasswordOtpMap({
            email: email,
            otp: hashedOtp
        });

        const savedrpom = await newrpom.save();

        if (savedrpom === null) {
            res.status(500).json({
                status: "error",
                data: {
                    message: "Internal server error, error in saving otp..."
                }
            });
            return;
        }

        sendmail(email, `<center><h1>Your OTP for reset password is <span style="background-color:rgb(153, 255, 204); color:black">${otp}</span>.</h1><br /><h2>Please don't share otp with anyone.<br />This otp will authomatically expires in 24hrs</h2></center>`);

        res.status(200).json({
            status: "success",
            data: {
                message: "Mail sent successfully for reset password"
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "Something went wrong...",
                err: err.message
            }
        });
        return;
    }
}


exports.verifyRP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const currUser = await User.findOne({ email: email });

        if (currUser === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "user dosen't exsists",
                }
            });
            return;
        }

        if (currUser.isActive === false) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Please verify the email to continue...",
                }
            });
            return;
        }

        const rpData = await ResetPasswordOtpMap.findOne({ email: email });

        if (rpData === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Missing the reset password data",
                }
            });
            return;
        }

        const matchOpt = await bcrypt.compare(otp, rpData.otp);
        // console.log(otp, rpData.otp, matchOpt);
        if (matchOpt !== true) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Otp doesnot match...",
                }
            });
            return;
        }

        rpData.isVerified = true;

        const savedRpData = await rpData.save()

        if (savedRpData === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Internal server error in saving otp status",
                }
            });
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                message: "Otp verified successfully",
            }
        });
        return;
    } catch {
        res.status(400).json({
            status: "error",
            data: {
                message: "Server error, something went wrong in resetting password",
            }
        });
        return;
    }
}


exports.changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const currRpOtp = await ResetPasswordOtpMap.findOne({ email: email });

        if (currRpOtp === null || currRpOtp.isVerified === false) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Bad request, not verfied user / otp"
                }
            });
            return;
        }

        const currUser = await User.findOne({ email: email });

        if (currUser === null || currUser.isActive === false) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Error in fetching user / User not exsists / User not verified mail",
                }
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        currUser.password = hashedPassword;

        const savedUser = await currUser.save();

        if (savedUser === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Error in saving password for the user",
                }
            });
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                message: "Successfully saved new password"
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "Internal server error in saving new password"
            }
        });
        return;
    }
}