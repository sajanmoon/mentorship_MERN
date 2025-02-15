const express = require("express");
const User = require("../models/user");
const userAuth = require("../middleware/auth");
const mentorRoute = express.Router();

// get all the mentors
mentorRoute.get("/", async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("-password");

    if (!mentors || mentors.length === 0) {
      return res.status(404).json({ message: "No mentors found" });
    }
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

mentorRoute.get("/:id", userAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const mentor = await User.findById(id).select("-password");
    if (!mentor || mentor.role !== "mentor") {
      return res.status(400).json({ message: "Mentor not found" });
    }
    res.send(mentor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

mentorRoute.put("/update", userAuth, async (req, res) => {
  const user = req.user;
  try {
    if (user.role !== "mentor") {
      return res.status(400).json({ message: "Only mentor can edit profile" });
    }

    const { skills, experience } = req.body;
    const updateMentor = await User.findByIdAndUpdate(
      user._id,
      { skills, experience },
      { new: true }
    );
    res.json(updateMentor);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = mentorRoute;
