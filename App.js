const mongoose = require("mongoose");
const express = require("express");
const app = express();
port = 7000;

const DB =
  "mongodb://loginform:loginform@ac-mhwr4fh-shard-00-00.goq0nte.mongodb.net:27017,ac-mhwr4fh-shard-00-01.goq0nte.mongodb.net:27017,ac-mhwr4fh-shard-00-02.goq0nte.mongodb.net:27017/mernstackloginform?ssl=true&replicaSet=atlas-2clrfs-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(DB);

//middleware
const middleware = (req, res, next) => {
  console.log("Hello middleware");
  next();
};

app.get("/", (req, res) => {
  res.send("Hello Server");
});
app.get("/about", middleware, (req, res) => {
  console.log("Hello About");
  res.send("My About Page");
});

app.listen(port, (req, res) => {
  console.log(`Server Is running on port ${port}`);
});
