const express = require('express');
const router = express.Router();

// importing Controllers
const UserController = require('../controllers/UserController');

// importing middleware for authentucating tokens and etc...
const AuthToken = require('../middleware/AuthToken');
const Rating=require("../controllers/Rating")
const ResponseController=require('../controllers/ResponseController');

router.route('/get-all-users').get(AuthToken.authToken, UserController.getAllUsers);
router.route('/userdetails').post( UserController.userDetails);
router.route('/getmoderators').get( UserController.getmoderators);
router.route('/addmoderator').post( UserController.addmoderator);
router.route('/removemoderator').post( UserController.removemoderator);

router.route('/get-solution').post(ResponseController.solutiondetails);
router.route('/submit-response').post(ResponseController.submitResponse);
router.route('/ranking').post(Rating.ranking);
module.exports = router;