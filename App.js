const express = require("express");
const app = express();

// dotenv
require("dotenv").config();

const Port = process.env.PORT || 3700;

// bodyparser
const BodyParser = require("body-parser");
app.use(BodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(BodyParser.json({ extended: true, limit: "50mb" }));

//cors
const cors = require("cors");
app.use(cors());

// session
app.use(
  require("express-session")({
    secret: process.env.SessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 172800000 },
  })
);

app.use(express.static("public"));

// mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.set("runValidators", true);
mongoose
  .connect(process.env.mongoUri)
  .then(() => {
    console.log("db connected");
    app.listen(Port, () => console.log(`http://localhost:${Port}`));
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// routes
app.use("/register", require("./routes/Auth/Register")); //register route
app.use("/login", require("./routes/Auth/Login")); //login route
