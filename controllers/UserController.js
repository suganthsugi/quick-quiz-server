const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    if(req.user.isAdmin){
        const allUsers = await User.find({});
        res.status(200).json({
            status:"error",
            data:{
                message:"successfully retrived all user details",
                allUsers:allUsers
            }
        })
    }
    else{
        res.status(400).json({
            status:"error",
            data:{
                message:"you don't have an access..."
            }
        })
    }
}