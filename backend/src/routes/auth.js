const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, role, skills, experience } =
    req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role,
      skills,
      experience,
    });

    await user.save();
    res.json({ message: "signup succesfully", user });
  } catch (error) {
    res.status(400).send("signup failed" + error);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!validator.isEmail(email)) {
      throw new Error("email is not valid");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign({ _id: user._id }, "DEV@123", {
        expiresIn: "7d",
      });
      console.log(token);

      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      res.send("login succesfull");
    } else {
      throw new Error("login failed");
    }
  } catch (error) {
    res.status(401).send("login failed" + error);
  }
});

module.exports = authRouter;
