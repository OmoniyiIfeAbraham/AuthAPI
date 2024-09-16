const express = require("express");
const { Errordisplay } = require("../../utils/Auth");
const { Sendmail } = require("../../utils/Mailer");
const User = require("../../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    // input
    let Collect = req.body;

    let checkExistingUser = await User.findOne({ Email: Collect.Email });
    if (checkExistingUser)
      return res.status(500).json({
        Access: true,
        Error: "A User with this Email already Exists.",
      });

    if (Collect.Password?.length < 6)
      return res.status(500).json({
        Access: true,
        Error: "Password must be more than 6 characters",
      });

    if (
      !Collect.Password?.includes("$") ||
      !Collect.Password?.includes(".") ||
      !Collect.Password?.includes("-") ||
      !Collect.Password?.includes("_") ||
      !Collect.Password?.includes(",") ||
      !Collect.Password?.includes("/") ||
      !Collect.Password?.includes("?") ||
      !Collect.Password?.includes("@") ||
      !Collect.Password?.includes("!") ||
      !Collect.Password?.includes("%") ||
      !Collect.Password?.includes("*") ||
      !Collect.Password?.includes("&")
    ) {
      return res.status(500).json({
        Access: true,
        Error:
          "Password SHould Contain One special character from the set (@, $, !, %, *, ?, &)",
      });
    }

    // hash password
    Collect.Password = bcrypt.hashSync(Collect.Password, 10);

    // create User
    const NewUser = await User.create(Collect);

    //response
    res.json({
      Access: true,
      Error: false,
      Registered: true,
    });

    //mailing
    await Sendmail(
      NewUser.Email,
      `Welcome ${NewUser.FirstName} ${NewUser.LastName}`,
      `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                  }
              
                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
              
                  .header {
                    text-align: center;
                    padding: 10px 0;
                  }
              
                  .header h1 {
                    color: #333333;
                  }
              
                  .content {
                    padding: 20px 0;
                  }
              
                  .cta-button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #4caf50;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                  }
              
                  .footer {
                    text-align: center;
                    padding: 10px 0;
                    color: #888888;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Welcome
                    }!</h1>
                  </div>
                  <div class="content">
                    <p>Hello ${NewUser.FirstName},</p>
                    <p>Thank you for Registering</p>
                  </div>
                  <div class="footer">
                    <p>For any assistance, feel free to contact our support team at support@gmail.com</p>
                  </div>
                </div>
              </body>
              </html>
              
              `
    );
  } catch (error) {
    res.status(500).json({ Access: true, Error: Errordisplay(error).msg });
  }
});

module.exports = router;
