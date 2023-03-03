const express = require('express');
const router = express.Router();

// importing Controllers
const AuthController = require('../controllers/AuthController');

router.route('/register').post(AuthController.register);
router.route('/verify-mail').post(AuthController.verifyMail);
router.route('/login').post(AuthController.login);
router.route('/forgot-password').post(AuthController.forgetPassword);
router.route('/verify-RP-otp').post(AuthController.verifyRP);
router.route('/change-password').post(AuthController.changePassword);


module.exports = router;