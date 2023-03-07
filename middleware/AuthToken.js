// thia is a middleware which is used to find the user is authenticated and type of the user
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// schema is imported to check the status of the user
const User = require('../models/User');

exports.authToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    if(cookies===undefined){
        res.status(402).json({
            status:'error',
            data:{
                message:"cookie not found"
            }
        });
        return;
    }
    const jwt_token = cookies.split("=")[1];
    console.log(jwt_token);
    // if the token has no value send error msg
    if (jwt_token === undefined) {
        res.status(401).json({
            status: "error",
            data: {
                msg: "jwt_token missing"
            }
        });
        return;
    }
    else {
        jwt.verify(jwt_token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                res.status(403).json({
                    status: "error",
                    data: {
                        msg: "the token is no longer valid or you dont have an access"
                    }
                });
                return;
            }

            // settingup all the user access for the current loggedin user for easy access
            if (user == undefined || user.user_id == undefined) {
                res.status(403).json({
                    status: "error",
                    data: {
                        msg: "the token is no longer valid or you dont have an access"
                    }
                });
                return;
            }
            const currUser = await User.findById(user.user_id);

            if(currUser===null || currUser.isActive===false){
                res.status(403).json({
                    status: "error",
                    data: {
                        msg: "user deleted / user inactive"
                    }
                });
                return;
            }

            user.isAdmin = currUser.isAdmin;
            user.isStaff = currUser.isStaff;
            user.isActive = currUser.isActive;

            // else we are going to set req.user to the current loggedin user
            req.user = user;
            next();
        });
    }
};