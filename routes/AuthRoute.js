const express = require('express');
const router = express.Router();

// importing Controllers
const AuthController = require('../controllers/AuthController');

// importing middleware for authentucating tokens and etc...
const AuthToken = require('../middleware/AuthToken');

router.route('/register').post(AuthController.register);
router.route('/verify-mail').post(AuthController.verifyMail);
router.route('/login').post(AuthController.login);
router.route('/forgot-password').post(AuthController.forgetPassword);
router.route('/verify-RP-otp').post(AuthController.verifyRP);
router.route('/change-password').post(AuthController.changePassword);
// router.route('/find-my-role').get(AuthToken.authToken, AuthController.findMyRole);
router.route('/logout').post(AuthController.logout);


module.exports = router;