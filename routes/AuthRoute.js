const express = require('express');
const router = express.Router();

// importing Controllers
const AuthController = require('../controllers/AuthController');

router.route('/register').post(AuthController.register);
router.route('/verifyMail').post(AuthController.verifyMail);


module.exports = router;