const mongoose = require("mongoose");
const DB = process.env.DATABASE;

const mongodb = async () => {
  try {
    await mongoose.connect(DB);
    console.log("connection successful");
  } catch (error) {
    console.log("No Connection");
  }
};

module.exports = mongodb;
