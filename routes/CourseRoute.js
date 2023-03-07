const express = require('express');
const router = express.Router();

// importing middleware for auth
const AuthToken = require('../middleware/AuthToken');

// importing course controller
const CourseController = require('../controllers/CourseController');

router.route('/').get(CourseController.getAllCourse).post(AuthToken.authToken, CourseController.addCourse);
router.route('/:title').get(CourseController.getCourseByTitle);


module.exports = router;