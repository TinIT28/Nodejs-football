const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainControllers');

router.route('/').get(mainController.main);


module.exports = router;