const express = require("express");
const router = express.Router();
router.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../db/conn");
const UserModel = require("../model/userSchema");
const Authenticate = require("../middleware/authenticate");

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
      console.log("New Model Created");
      await user.save();
      console.log("Model Saved in Database");
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

    res.cookie("jwtoken", token, {
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

// about ka page

router.get("/about", Authenticate, (req, res) => {
  console.log("Hello About");
  res.send(req.rootUser);
});

router.get("/getdata", Authenticate, (req, res) => {
  console.log("Hello getdata");
  res.send(req.rootUser);
});

// Contact us page

router.post("/contact", Authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("Pls fill the contact form");
      return res.json({ error: "Pls fill the contact form" });
    }
    const userContact = await UserModel.findOne({ _id: req.userID });
    console.log("userContact", userContact);
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      console.log("userMessage", userMessage);
      await userContact.save();
      res.status(201).json({ message: "Messsage save successfully" });
    }
  } catch (error) {}
});

// Logout Page

router.get("/logout", (req, res) => {
  console.log("Hello my logout page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout"); // Corrected syntax
});

module.exports = router;
