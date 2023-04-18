const User = require("../models/User");

exports.ranking = async (req, res) => {
  try {
    const users = await User.find({}, { email: 1, Rating: 1, _id: 1 })
      .sort({ Rating: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
