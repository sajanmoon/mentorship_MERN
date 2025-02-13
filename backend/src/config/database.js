const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sajanmoon5:moonprsajan@devtinderapp.qqjcu.mongodb.net/mentor"
  );
};

module.exports = connectDB;
