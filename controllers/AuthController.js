const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const crypto = require('crypto');

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

        const otp = crypto.randomUUID();

        const savedUser = await newUser.save();

        sendmail(email, `<center><h1>Click the link below to verify your mail for Quick Quiz</h1><br /><br /><h4><a href="https://quick-quiz.onrender.com/accounts/verify-mail/verify?uuid=${otp}" target="_blank">https://quick-quiz.onrender.com/verify-email/verify?uuid=${otp}</a></h4><br /><h2>Please don't share otp with anyone.<br />This otp will authomatically expires in 24hrs</h2></center>`);

        const newOtpMap = new OtpMap({
            email,
            phno,
            otp: otp
        });

        const savedOtpMap = await newOtpMap.save();

        if (savedOtpMap === null) {
            res.status(500).json({
                status: "error",
                data: {
                    message: "error in saving the otp"
                }
            });
            return;
        }

        // console.log(User.find({ email: email }), OtpMap.findOne({ email: email }));
        res.status(200).json({
            status: "success",
            data: {
                message: "Successfully registered user",
                user: savedUser
            }
        });
        return;

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
    const success_html = `<!doctype html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    
        <title>Quick Quiz - Mail Verified</title>
      </head>
      <body><!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Email Verification Success</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.6.0/css/bootstrap.min.css">
        </head>
        <body class="bg-dark">
          <div class="container">
            <div class="row justify-content-center mt-5">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-dark text-white">
                    <h4 class="text-center">Email Verified - Quick Quiz</h4>
                  </div>
                  <div class="card-body">
                    <p class="my-5 text-center">Your email address has been successfully verified.</p>
                    <center><a href="/" class="btn btn-outline-dark px-5 py-2">Login</a></center>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
        
      </body>
    </html>`

    const error_html = `<!doctype html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    
        <title>Quick Quiz - Mail Verification Error</title>
      </head>
      <body><!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Email Verification Error</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.6.0/css/bootstrap.min.css">
        </head>
        <body class="bg-dark">
          <div class="container">
            <div class="row justify-content-center mt-5">
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header bg-dark text-white">
                    <h4 class="text-center">Email not Verified - Quick Quiz</h4>
                  </div>
                  <div class="card-body">
                    <p class="my-5 text-center">Error in Verification - Kindly click on the link provided in your mail</p>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
        
      </body>
    </html>`

    try {
        const otp = req.query.uuid;
        // console.log(otp);
        if (otp === undefined) {
            res.send(error_html)
            return;
        }
        const pendingUser = await OtpMap.findOne({ otp: otp });



        // console.log(pendingUser);
        if (pendingUser === null) {
            res.send(error_html);
            return;
        }
        // console.log(pendingUser);
        const currUser = await User.findOne({ email: pendingUser.email });

        if (currUser.isActive === true) {
            res.send(success_html);
            return;
        }



        const timestamp = new Date(pendingUser.createdAt).getTime();
        const now = Date.now();

        const diffSeconds = Math.floor((now - timestamp) / 1000);

        // console.log(diffSeconds);
        if (diffSeconds > 300) {
            res.send(error_html);
            return;
        }

        if (otp !== pendingUser.otp) {
            res.send(error_html);
            return;
        }

        currUser.isActive = true;
        const savedUser = await currUser.save();

        if (savedUser === null) {
            res.send(error_html);
            return;
        }

        await OtpMap.deleteOne({ otp: otp });

        res.send(success_html);
        return;

    } catch (err) {
        res.send('500 Server Error')
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
            res.status(200).json({
                status: "error",
                data: {
                    message: "Mail not verified, Please check mail and verify mail to loin..."
                }
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, currUser.password);

        if (passwordMatch === true) {
            const jwt_token = jwt.sign({ user_id: currUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            // res.cookie('myCookie', 'someValue', { maxAge: 900000 });
            res.cookie('jwt_token', jwt_token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                httpOnly: true,
                sameSite: 'lax',
            });

            res.status(200).json({
                status: "success",
                data: {
                    message: "Successfully loggedin"
                },
                details: {
                    user_id: currUser._id,
                    firstName: currUser.firstName,
                    lastName: currUser.lastName
                }
            });
            console.log(res);
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

        const tempFP = await ResetPasswordOtpMap.findOne({ email: email });
        if (tempFP !== null) {
            await ResetPasswordOtpMap.deleteOne({ email: email });
        }

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

        const timestamp = new Date(rpData.createdAt).getTime();
        const now = Date.now();

        const diffSeconds = Math.floor((now - timestamp) / 1000);

        // console.log(diffSeconds);
        if (diffSeconds > 300) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Otp expired...",
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

        await ResetPasswordOtpMap.deleteOne({ email: email })

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

exports.logout = async (req, res) => {
    try {
        res.clearCookie('jwt_token');
        res.status(200).json({
            status: "success",
            data: {
                message: "loggedout successfully"
            }
        });
        return;
    } catch (err) {
        res.status(400).json({
            status: "error",
            data: {
                message: "failed to logout",
                err: err.message
            }
        })
    }
}

// exports.findMyRole = (req, res) => {
//     if(req.user.isAdmin){
//         res.send("y'r admin");
//         return;
//     }
//     if(req.user.isStaff){
//         res.send("y'r moderator");
//         return;
//     }
//     res.send("y'r a standard user");
// }