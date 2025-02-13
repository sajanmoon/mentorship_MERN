const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      throw new Error("invalid credentials please login");
    }
    const decodedMessage = jwt.verify(token, "DEV@123");
    const { _id } = decodedMessage;
    console.log("loggedin user is" + _id);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("userAuth failed" + error);
  }
};

module.exports = userAuth;
