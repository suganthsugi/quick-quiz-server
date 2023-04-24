const User = require("../models/User");

exports.ranking = async (req, res) => {
  try {
    const {id}=req.body;
    const users = await User.find({}, { email: 1, Rating: 1, _id: 1 })
      .sort({ Rating: -1 });
   const one=await User.findOne({_id:id});
    let rank=0;
    users.forEach((user, index) => {
      if (user._id == id) {
        rank++;
        res.status(200).json({users,rank,self:one});
        return;
      } else {
        rank++;
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
