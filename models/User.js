const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  FirstName: {
    type: String,
    required: [true, "First Name is Required"],
  },
  LastName: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  Email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email is invalid",
    ],
  },
  Password: {
    type: String,
    required: [true, "Password is Required"],
  },
});

module.exports = mongoose.model("User", User);
