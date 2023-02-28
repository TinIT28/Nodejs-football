const express = require('express');
const router = express.Router();
const playersController = require("../controllers/playersController");
const authenticate = require("../middelware/authenticate");
const authorization = require("../middelware/authorization");

router
  .route("/")
  .get(authenticate.verifyUser, playersController.players)
  .post(
    authenticate.verifyUser,
    authorization.isAdmin,
    playersController.create
  );
router
  .route("/:id")
  .get(authenticate.verifyUser, playersController.playerDetails);
router
  .route("/edit/:id")
  .get(
    authenticate.verifyUser,
    authorization.isAdmin,
    playersController.formEdit
  )
  .put(
    authenticate.verifyUser,
    authorization.isAdmin,
    playersController.update
  );
router
  .route("/delete/:id")
  .delete(
    authenticate.verifyUser,
    authorization.isAdmin,
    playersController.delete
  );

module.exports = router;