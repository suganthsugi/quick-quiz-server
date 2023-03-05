// importing schema for creating reference instance
const QuestionPaper = require('../models/QuestionPaper');

exports.getAllQuestions = async (req, res) => {
    try {

        const allQuestions = await QuestionPaper.find({});

        res.status(200).json({
            status:"success",
            data:{
                message:"successfully got all questions",
                allQuestions
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "server error"
            }
        });
        return;
    }
}


exports.getQuestionById = async (req, res) => {
    try {
        if(!req.params.question_id){
            res.status(400).json({
                status:"success",
                data:{
                    message:"Please provie a search term"
                }
            });
            return;
        }
        const question = await QuestionPaper.findById(req.params.question_id);
        if(question===null){
            res.status(400).json({
                status:"success",
                data:{
                    message:"question not found"
                }
            });
            return;
        }
        res.status(200).json({
            status:"success",
            data:{
                message:"question fetched successfully",
                question
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status:"error",
            data:{
                message:"server error",
                err:err.message
            }
        });
        return;
    }
}


exports.getQuestionBySearch = async (req, res) => {
    try {
        const query = req.params.query;
        if(!query){
            res.status(400).json({
                status:"success",
                data:{
                    message:"Please provie a search term"
                }
            });
            return;
        }
        const question = await QuestionPaper.find({$or: [{categoryName: query}, {topic: { $regex: query, $options:"i" }}]});
        if(question.length===0){
            res.status(400).json({
                status:"success",
                data:{
                    message:"question not found"
                }
            });
            return;
        }
        res.status(200).json({
            status:"success",
            data:{
                message:"question fetched successfully",
                question
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status:"error",
            data:{
                message:"server error",
                err:err.message
            }
        });
        return;
    }
}


exports.addNewQuestionPaper = async (req, res) => {
    try {
        if (req.user.isAdmin === false) {
            res.status(404).json({
                status: "error",
                data: {
                    message: "Bad request, you don't have an access to this action"
                }
            });
            return;
        }

        const { topic, categoryName, questions, mode } = req.body;

        // checking the data
        if (topic === undefined || categoryName === undefined || questions === undefined || mode === undefined) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "data missing"
                }
            });
            return;
        }
        if (questions.length === 0) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "no questions found"
                }
            });
            return;
        }
        const checkTopic = await QuestionPaper.findOne({topic:topic})
        if(checkTopic !== null){
            res.status(400).json({
                status: "error",
                data: {
                    message: `Question paper alredy exsists with name ${topic}. Please change the topic`
                }
            });
            return;
        }

        // checking the question data
        for (let i = 0; i < questions.length; i++) {
            const { question, choices, correctAnswer, mark, explaination, mode } = questions[i];
            if (question === undefined || choices === undefined || correctAnswer === undefined || mark === undefined || explaination === undefined || mode === undefined) {
                res.status(400).json({
                    status: "error",
                    data: {
                        message: `in question ${i + 1} data missing`
                    }
                });
                return;
            }
        }

        // creating question paper
        const newQuestionPaper = new QuestionPaper({
            topic,
            categoryName,
            questions,
            mode
        });

        const savedQP = await newQuestionPaper.save();

        if (savedQP === null) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "error in saving a question paper"
                }
            });
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                message: "successfully saved question paper"
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "Server error",
                err:err.message
            }
        });
        return;
    }
}
