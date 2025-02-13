const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

profileRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("feed failed" + error);
  }
});

module.exports = profileRouter;
