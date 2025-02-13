const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const mentorRoute = require("./routes/mentor");
const mentorRequestRoute = require("./routes/mentorRequest");

const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/", profileRouter);
app.use("/api/mentors", mentorRoute);
app.use("/api/mentorRequest", mentorRequestRoute);

app.use("/hello", (req, res) => {
  res.send("hello from the server");
});

connectDB()
  .then(() => {
    console.log("database connected succesfully");
    app.listen(3000, () => {
      console.log("server is succesfully listening");
    });
  })
  .catch(() => {
    console.log("database connection failed");
  });
