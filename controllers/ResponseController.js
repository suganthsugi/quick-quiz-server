const QuestionPaper = require('../models/QuestionPaper');
const Response=require("../models/Response");

exports.submitResponse=async(req,res)=>{
    try
    {
    const {answerScript,uid,qid}=req.body;
    const qset=await QuestionPaper.findById(qid);
    res.status(200).json({
        data:qset
    });
    }
    catch(err)
    {
        res.status(500).json({
            status: "error",
            data: {
                message: "server error"
            }
        });
        return;
    }
}