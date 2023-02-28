const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bycrypt = require("bcrypt");
const sendToken = require("../utils/jwttoken");
const { getToken } = require("../middelware/authenticate");
const authenticate = require("../middelware/authenticate");

class userController {
  async register(req, res, next) {
    const { username, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ username });
    let errors = [];
    if (existingUser) {
      errors.push("Username is existing");
    }

    if (password.length < 6) {
      errors.push("Password must be more than 6 characters");
    }

    if (password !== confirmPassword) {
      errors.push("Confirm password not matched!");
    }

    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }

    if (password === confirmPassword) {
      const salt = await bycrypt.genSalt(10);
      const hashPassword = await bycrypt.hash(password, salt);
      try {
        const user = await User.create({ username, password: hashPassword });
        sendToken(user, 200, res);
        res.status(200).json({ success: true, user: user });
      } catch (error) {
        console.log(error);
        errors.push("Fail to create user");
        res.status(400).json({ success: false, errors });
      }
    }
  }

  loginPage(req, res, next) {
    res.render("login");
  }

  dashboard(req, res, next) {
    res.render("dashboard");
  }

  login(req, res, next) {
    var messages = req.flash("error");
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.render("main", { messages: messages });
  }

  signout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "You are loggouted");
      res.redirect("/users/login");
    });
  }
}

module.exports = new userController();
