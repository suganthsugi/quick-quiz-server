const QuestionPaper = require('../models/QuestionPaper');
const Response=require("../models/Response");

exports.submitResponse=async(req,res)=>{
    try
    {
    const {answerScript,uid,qid}=req.body;
    const qset=await QuestionPaper.findById(qid);
    const eachQuestion=qset.questions;
    let score=0;
    let totalScore=0;
    let correctCount=0; 
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