const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController')

router.route('/').get(playersController.players).post(playersController.create);
router.route('/edit/:id').get(playersController.formEdit)

module.exports = router;