const User = require("../service/schemas/users");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../service/userService");
require("dotenv").config();
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const emailService = require("../service/emailService");
const secret = process.env.SECRET;
var uuid = require("uuid");

const signupCtrl = async (req, res, next) => {
  const { username, email, password, subscription, token } = req.body;
  const user = await getUserByEmail(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const verificationToken = uuid.v1();
    const avatarURL = gravatar.url(email);
    const newUser = new User({
      username,
      email,
      subscription,
      token,
      avatarURL,
      verificationToken,
    });
    newUser.setPassword(password);
    await newUser.save();

    emailService.sendEmail(email, verificationToken);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          username,
          email,
          avatarURL,
          verificationToken,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = signupCtrl;
