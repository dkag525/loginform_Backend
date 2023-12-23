const mongoose = require("mongoose");
const DB = process.env.DATABASE;

const connectdb = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connection successful");
  } catch (error) {
    console.error("connection failed:", error);
  }
};

module.exports = connectdb;
