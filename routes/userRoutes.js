const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);

router.route('/').get(userController.getAllUsers);
router.route('/:id').get().patch().delete();

module.exports = router;
