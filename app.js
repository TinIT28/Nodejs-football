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

const nationsRouter = require("./routes/nationsRoute");
const playersRouter = require("./routes/playersRoute");
const mainRouter = require("./routes/mainRoute");

const app = express();
var blocks = {};
app.use(methodOverride("_method"));

// view engine setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + "/views/layouts");
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
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
