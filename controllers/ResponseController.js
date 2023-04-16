const QuestionPaper = require('../models/QuestionPaper');
const Response=require("../models/Response");

exports.submitResponse=async(req,res)=>{
    try
    {
    const {answerscript,uid,qid}=req.body;
    const qset=await QuestionPaper.findById(qid);
    const eachQuestion=qset.questions;
    var score=0;
    var totalScore=0;
    var correctCount=0; 
    eachQuestion.forEach(data => {
        if(answerscript[data.question]==data.correctAnswer)
        {
           score=score+data.mark;
           correctCount+=1;
        }
        totalScore+=data.mark;
    });
    const oldresponse=await Response.findOne({user:uid,qnPaper:qid});
    console.log(oldresponse);

    if(oldresponse!=null  && oldresponse.score>=score)
    {
        res.json({
            score,
            totalScore,
            correctCount,
            totalCount:eachQuestion.length,
            status:"already"
                })
        return;
    
    }
    else if(oldresponse!=null && oldresponse.score<score){
        const q=await Response.updateOne({user:uid,qnPaper:qid},
            {
                user:uid,
                qnPaper:qid,
                type:qset.type,
                totalquestions:eachQuestion.length,
                correctanswers:correctCount,
                totalscore:totalScore,
                score
               });
               res.json({
                score,
                totalScore,
                correctCount,
                totalCount:eachQuestion.length,
                status:"already updated"
                    })
            return;
    }
else
{
   const newResponse =new Response({
    user:uid,
    qnPaper:qid,
    type:qset.type,
    totalquestions:eachQuestion.length,
    correctanswers:correctCount,
    totalscore:totalScore,
    score
   })

   const respond=await newResponse.save();
   res.json({
    score,
    totalScore,
    correctCount,
    totalCount:eachQuestion.length
})
return;
}
    }
    catch(err)
    {
        res.status(500).json({
            status: "error",
            data: {
                message: "server error",
                type:err
            }
        });
        return;
    }
}