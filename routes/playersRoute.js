const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController')

router.route('/').get(playersController.players).post(playersController.create);
router.route("/:id").get(playersController.playerDetails);
router
  .route("/edit/:id")
  .get(playersController.formEdit)
  .put(playersController.update);
router.route("/delete/:id").delete(playersController.delete);

module.exports = router;