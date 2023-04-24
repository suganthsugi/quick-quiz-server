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

exports.getmoderators=async(req,res)=>{
    try
    {
        const users = await User.find({ $or: [ { isAdmin: true }, { isStaff: true } ] });
        res.json({
            data:users
        })
    }
    catch(err)
    {
        res.json({err});
    }
}

exports.addmoderator=async(req,res)=>{
    try
    {
        const {email,role}=req.body;
        if(role=="isStaff")
        {
            const users = await User.findOneAndUpdate({email},{$set:{isStaff:true}});
        
            res.json({
                data:"success staff added"
            })
            return
        }
        else if(role=="isAdmin")
        {
            const users = await User.findOneAndUpdate({email},{$set:{isAdmin:true}});
        
            res.json({
                data:"success Admin added"
            })
            return
        }
        res.json({
            data:"success but no matched option"
        })
    }
    catch(err)
    {
        res.json({err});
    }
}
exports.removemoderator=async(req,res)=>{
    try
    {
        const {email}=req.body;
        
            const users = await User.findOneAndUpdate({email},{$set:{isAdmin:false,isStaff:false}});
    
         
        
        res.json({
            data:"success"
        })
    }
    catch(err)
    {
        res.json({err});
    }
}