const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bycrypt = require("bcrypt");
const sendToken = require("../utils/jwttoken");
const { getToken } = require("../middelware/authenticate");
const authenticate = require("../middelware/authenticate");

class userController {
  registerPage(req, res, next) {
    res.render("register");
  }

  async register(req, res, next) {
    const { username, password, confirmPassword, fullName, dateOfBirth } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        req.flash("error_msg", "Username already exists");
        return res.redirect("/users/register");
      }

      // Check if the password is too short
      if (password.length < 6) {
        req.flash("error_msg", "Password must be at least 6 characters");
        return res.redirect("/users/register");
      }

      // Check if the passwords match
      if (password !== confirmPassword) {
        req.flash("error_msg", "Passwords do not match");
        return res.redirect("/users/register");
      }

      // Create a new user with a hashed password
      const salt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, salt);
      const newUser = new User({
        username,
        password: hashedPassword,
        fullName,
        dateOfBirth,
      });
      await newUser.save();

      // Redirect the user to the login page
      req.flash("success_msg", "You are now registered and can log in");
      res.redirect("/users/login");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Failed to create user");
      res.redirect("/users/register");
    }
  }
  

  loginPage(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("login");
    }
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

  getUsers(req, res, next) {
    User.find({})
      .then((users) => {
        res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.user = req.user
        res.render("users", {
          title: "Users",
          users: users,
        });
      })
      .catch(next);
  }

  userDetails(req, res, next) {
    const slug = req.params.slug;
    if (!slug) {
      return next(new Error("User not found"));
    }
    const userQuery = { slug: slug };
    User.findOne(userQuery)
      .then((user) => {
        res.locals.isAuthenticated = req.isAuthenticated();
        res.locals.user = req.user;
        res.render("userDetails", {
          title: "User details",
          user: user
        })
      })
      .catch(next);
  }

  formEdit(req, res, next) {
    const userId = req.params.id;
    User.findById(userId).then((user) => {
      res.json({
        user: {
          id: user._id,
          fullName: user.fullName,
          birth: user.dateOfBirth
        }
      })
    })
  }

  update(req, res, next) {
    const id = req.params.id;
    if (!id) {
      return next(new ErrorHandler("Not found users", 404));
    }
    User.findByIdAndUpdate(id, req.body, { new: true })
      .then((user) => {
        res.redirect("/users/" + id);
      })
      .catch(next);
  }
}

module.exports = new userController();
