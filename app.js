const createError = require("http-errors");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const hbs = require("hbs");
const errorMiddleware = require("./middelware/error");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDatabase = require("./config/database");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const slugify = require("slugify");
require("./middelware/passport")(passport);

const nationsRouter = require("./routes/nationsRoute");
const playersRouter = require("./routes/playersRoute");
const usersRouter = require("./routes/usersRoute");
const mainRouter = require("./routes/mainRoute");

const app = express();
var blocks = {};
app.use(methodOverride("_method"));

// view engine setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + "/views/layouts");
hbs.registerHelper("stringify", function (obj) {
  return JSON.stringify(obj);
});
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});
hbs.registerHelper("toString", function (a) {
  return a.toString();
});
hbs.registerHelper("isNotEmpty", function (a) {
  return a && a.length > 0;
});
hbs.registerHelper("isTrue", function (a) {
  return a === true;
});
hbs.registerHelper("isFalse", function (a) {
  return a === false;
});
hbs.registerHelper("notExist", function (a) {
  return !a;
});
hbs.registerHelper("firstChar", function (a) {
  return a.trim().charAt(0).toUpperCase();
});

app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.err_msg = req.flash("err_msg");
  next();
});

app.use(express.static(__dirname + "/public"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/nations", nationsRouter);
app.use("/", mainRouter);
app.use("/players", playersRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Middleware for Errors
app.use(errorMiddleware);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
