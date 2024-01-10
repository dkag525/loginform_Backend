const jwt = require("jsonwebtoken");
const UserModel = require("../model/userSchema");
// const cookie = require("cookie");

const Authenticate = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie; // get the token from req headers
    // console.log("cookieHeader", cookieHeader);
    const token = cookieHeader && cookieHeader.split("=")[1];
    // console.log("is token", token);
    if (!token) {
      return res.status(401).send("Unauthorised : No token Provided");
    }

    // if token avilable then verify the token

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("is verifytoken", verifyToken);
    // Find the user based on the token and user ID

    const rootUser = await UserModel.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    // console.log("rootUser", rootUser);

    if (!rootUser) {
      return res.status(401).send("Unauthorized : Invalid token");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).send("Unauthorized : Invalid token");
  }
};

module.exports = Authenticate;
