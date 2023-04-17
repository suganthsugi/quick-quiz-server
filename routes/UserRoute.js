const express = require('express');
const router = express.Router();

// importing Controllers
const UserController = require('../controllers/UserController');

// importing middleware for authentucating tokens and etc...
const AuthToken = require('../middleware/AuthToken');

const ResponseController=require('../controllers/ResponseController');

router.route('/get-all-users').get(AuthToken.authToken, UserController.getAllUsers);
router.route('/userdetails').post( UserController.userDetails);

router.route('/submit-response').post(ResponseController.submitResponse);

module.exports = router;