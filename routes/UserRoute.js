const express = require('express');
const router = express.Router();

// importing Controllers
const UserController = require('../controllers/UserController');

// importing middleware for authentucating tokens and etc...
const AuthToken = require('../middleware/AuthToken');

router.route('/get-all-users').get(AuthToken.authToken, UserController.getAllUsers);


module.exports = router;