const express = require('express');
const router = express.Router();
const nationsController = require('../controllers/nationsController');

router.route('/').get(nationsController.nations).post(nationsController.create);
router.route('/:id').get(nationsController.nationDetail)
router.route('/edit/:id').get(nationsController.formEdit).put(nationsController.update);
router.route('/delete/:id').delete(nationsController.delete);


module.exports = router;
