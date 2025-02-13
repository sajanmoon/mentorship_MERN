const express = require("express");
const userAuth = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const mentorRequestRoute = express.Router();

mentorRequestRoute.post("/sendreq", userAuth, async (req, res) => {
  try {
    const { mentorId, message } = req.body;
    const user = req.user;

    if (user.role !== "student") {
      return res.status(400).send("only student can send request");
    }

    //   check if the mentor even exist
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({ message: "mentor not found" });
    }

    //   checking if connection already exist
    const existingRequest = await ConnectionRequest.findOne({
      student: user._id,
      mentor: mentorId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "request already exist" });
    }

    //   creating a new instance
    const request = new ConnectionRequest({
      student: user._id,
      mentor: mentorId,
      message,
    });

    await request.save();
    res.status(400).send("request sent");
  } catch (error) {
    res.status(500).send("connection failed" + error);
  }
});

// FETCH ALL THE REQUEST
mentorRequestRoute.get("/getreq", userAuth, async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
      return res.status(403).send("only mentor can see the request");
    }

    const request = await ConnectionRequest.find({
      mentor: req.user._id,
    }).populate("student", "name email");

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "fetching request failed" });
  }
});

// ACCEPT OR REJECT REQUEST

mentorRequestRoute.put("/acceptreq/:id", userAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // find the mentor
    const request = await ConnectionRequest.findById(req.params.id);
    if (!request) {
      return res.status(400).send("request not found");
    }

    // Ensure only the mentor can update the request
    if (request.mentor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this request" });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status} succesfully` });
  } catch (error) {
    res.status(500).send("accept failed" + error);
  }
});

module.exports = mentorRequestRoute;
