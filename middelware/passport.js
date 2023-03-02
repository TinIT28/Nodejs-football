const passport = require("passport");
const bycrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/usersModel");
const flash = require("connect-flash");
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        failureFlash: true,
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        // Match user
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              req.flash("error_msg", "This username is not registed");
              return done(null, false);
            }
            // Compare password
            if (password.length < 6) {
              req.flash("error_msg", "Password must be more than 6 characters");
              return done(null, false);
            }
            bycrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                req.flash("error_msg", "Password isn't correct");
                return done(null, false);
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
