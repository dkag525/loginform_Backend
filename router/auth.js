const express = require("express");
const router = express.Router();
router.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../db/conn");
const UserModel = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Hello Server from router js");
});

router.post("/signup", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  //   res.json({ message: req.body });
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Pls fill all the fields" });
  }

  try {
    const userExist = await UserModel.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not match" });
    } else {
      const user = new UserModel({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });
      console.log("ram");
      await user.save();
      console.log("shyam");
      res.status(201).json({ message: "user registered successfuly" });
    }

    //.....//
  } catch (err) {
    console.log({ error: "Error in Registering" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in the data" });
    }

    const userLogin = await UserModel.findOne({ email: email });

    if (!userLogin) {
      return res.json({ error: "User Not Registered" }); // i add this Line
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);

    token = await userLogin.generateAuthToken();
    console.log("Generate Token", token);

    res.cookie("twtoken", token, {
      expire: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });

    if (!isMatch) {
      return res.json({ error: "Invalid Credientials" });
    } else {
      return res.json({ message: "User login successful" });
    }
  } catch (error) {
    console.log({ error: "Signin Not Working" });
  }
});

module.exports = router;
