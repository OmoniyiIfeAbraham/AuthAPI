const express = require("express");
const { Errordisplay } = require("../../utils/Auth");
const User = require("../../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    // input
    let Collect = req.body;

    // find user
    let user = await User.findOne({ Email: Collect.Email });
    if (!user)
      return res
        .status(500)
        .json({ Access: true, Error: "User Doesn't Exist." });

    // verify password
    let PasswordVerif = bcrypt.compareSync(Collect.Password, user.Password);
    if (!PasswordVerif)
      return res
        .status(500)
        .json({ Access: true, Error: "Incorrect Password." });

    return res.json({ Access: true, Error: false, user: user });
  } catch (error) {
    res.status(500).json({ Access: true, Error: Errordisplay(error).msg });
  }
});

module.exports = router;
