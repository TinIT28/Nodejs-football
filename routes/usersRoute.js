const userController = require("../controllers/usersController");
const express = require("express");
const router = express.Router();
const authenticate = require("../middelware/authenticate");
const authorization = require("../middelware/authorization");
const passport = require("passport");
require("../middelware/passport")(passport);

router
  .route("/register")
  .get(userController.registerPage)
  .post(userController.register);
router
  .route("/login")
  .get(userController.loginPage)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/login",
      failureFlash: true,
    }),
    (req, res) => {
      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Authorization", token);
      res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
      });
    }
  );
router
  .route("/")
  .get(authenticate.verifyUser, authorization.isAdmin, userController.getUsers);
router.route("/logout").post(userController.signout);
router.route("/:slug").get(authenticate.verifyUser, userController.userDetails);
router
  .route("/edit/:id")
  .get(authenticate.verifyUser, userController.formEdit)
  .put(authenticate.verifyUser, userController.update);

module.exports = router;
