const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
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

userSchema.method.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {}
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
