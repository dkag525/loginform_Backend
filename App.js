const express = require("express");
const cors = require("cors");
const app = express();
const port = 7000;

app.use(cors());

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const User = require("./model/userSchema");

const connectdb = require("./db/conn");
connectdb();

app.use(express.json());
app.use(require("./router/auth"));

//middleware
// const middleware = (req, res, next) => {
//   console.log("Hello middleware");
//   next();
// };

// app.get("/", (req, res) => {
//   res.send("Hello Server");
// });

// Moves to Auth

// app.get("/about", (req, res) => {
//   console.log("Hello About");
//   res.send("My About Page");
// });
app.get("/contact", (req, res) => {
  res.cookie("Test", "Thapa");
  console.log("Hello About");
  res.send("My About Page");
});

app.listen(port, (req, res) => {
  console.log(`Server Is running on port ${port}`);
});
