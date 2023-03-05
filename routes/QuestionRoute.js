const express = require('express');
const router = express.Router();

// importing middleware for auth purpose
const AuthToken = require('../middleware/AuthToken');

// importing controller
const QuestionController = require('../controllers/QuestionController');

router.route('/').get(QuestionController.getAllQuestions)
router.route('/:question_id').get(QuestionController.getQuestionById)
router.route('/search/:query').get(QuestionController.getQuestionBySearch)
router.route('/new').post(AuthToken.authToken, QuestionController.addNewQuestionPaper);

module.exports = router;