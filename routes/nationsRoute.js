const express = require('express');
const router = express.Router();
const nationsController = require('../controllers/nationsController');
const authenticate = require("../middelware/authenticate");
const authorization = require("../middelware/authorization");
const passport = require("passport");
const passportConfig = require("../middelware/authenticate");
const { ensureAuthenticated } = require("../middelware/auth");

router
  .route("/")
  .get(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationsController.nations
  )
  .post(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationsController.create
  );
router
  .route("/:id")
  .get(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationsController.nationDetail
  );
router
  .route("/edit/:id")
  .get(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationsController.formEdit
  )
  .put(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationsController.update
  );
router
  .route("/delete/:id")
  .delete(
    authenticate.verifyUser,
    authorization.isAdmin,
    nationsController.delete
  );


module.exports = router;
