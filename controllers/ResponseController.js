const QuestionPaper = require('../models/QuestionPaper');
const Response=require("../models/Response");

exports.submitResponse=async(req,res)=>{
    try
    {
    const {answerScript,uid,qid}=req.body;
    const qset=await QuestionPaper.findById(qid);
    const eachQuestion=qset.questions;
    var score=0;
    var totalScore=0;
    var correctCount=0; 
    eachQuestion.forEach(data => {
        if(answerScript[data.question]==data.correctAnswer)
        {
           score=score+data.mark;
           correctCount+=1;
        } 
        totalScore+=data.mark;
    });
    res.json({
        score,
        totalScore,
        correctCount,
        totalCount:eachQuestion.length()
    })
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