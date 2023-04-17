const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        if(req.user.isAdmin){
            const allUsers = User.find();
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
            });
        }
    } catch (err) {
        res.status(500).json({
            status:"error",
            data:{
                message:"something went wrong..."
            }
        });
    }
}
exports.userDetails=async(req,res)=>{
    try
    {
        const {uid}=req.body;
        const result=await User.findOne({_id:uid});
        res.json({
            data:result
        })

    }
    catch(err)
    {
        res.json({
            err
        })
    }
}