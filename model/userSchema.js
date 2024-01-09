const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function () {
      // Format the date as per Indian style
      return this.createdAt.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
    },
  },
  tokens: [{ token: { type: String, required: true } }],
});

//.........//
userSchema.pre("save", async function (next) {
  console.log("Hi I M Pre Method");
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
    this.cpassword = bcrypt.hashSync(this.cpassword, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
    console.log("this is my token no. :", token);
    console.log("Token generate in userSchema:", token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    window.alert("Token not genrated");
    console.log("Token not genrated");
  }
};

const Users = mongoose.model("usercollection", userSchema);

module.exports = Users;
