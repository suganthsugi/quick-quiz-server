const Course = require('../models/Course');
const QuestionPaper = require('../models/QuestionPaper');

exports.addCourse = async (req, res) => {
    try {
        if (req.user.isAdmin === false && req.user.isStaff === false) {
            res.status(400).json({
                status: "error",
                data: {
                    message: "Not authorized"
                }
            });
            return;
        }

        const { title, desc } = req.body;

        if (title === undefined || desc === undefined) {
            res.status(404).json({
                status: "error",
                data: {
                    message: "Data needed is missing"
                }
            });
            return;
        }

        const newCourse = new Course({
            title,
            desc,
            createdBy: req.user.user_id
        });

        const savedCourse = await newCourse.save();

        if (savedCourse === null) {
            res.status(404).json({
                status: "error",
                data: {
                    message: "error in saving course"
                }
            });
            return;
        }

        res.status(200).json({
            status: "success",
            data: {
                message: "course created successfully"
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "server error",
                err: err.message
            }
        });
        return;
    }
}


exports.getAllCourse = async (req, res) => {
    try {
        const allCourse = await Course.find({});
        res.status(200).json({
            status:"success",
            data:{
                message:"successfully fetched all courses",
                allCourses:allCourse
            }
        });
        return;
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "server error",
                err: err.message
            }
        });
        return;
    }
}

exports.getCourseByTitle = async (req, res) => {
    try {
        // console.log(req.params.title);
        const course = await Course.find({title:req.params.title});
        const questionPapers = await QuestionPaper.find({categoryName:req.params.title});
        if(course===null){
            res.status(200).json({
                status: "error",
                data: {
                    message: "no course found",
                    course,
                    questionPapers
                }
            });
            return;
        }
        if(questionPapers===null){
            res.status(200).json({
                status: "error",
                data: {
                    message: "no question papers found",
                    course,
                    questionPapers
                }
            });
            return;
        }
        res.status(200).json({
            status: "error",
            data: {
                message: "no course found",
                course,
                questionPapers
            }
        });        
    } catch (err) {
        res.status(500).json({
            status: "error",
            data: {
                message: "server error",
                err: err.message
            }
        });
        return;
    }
}