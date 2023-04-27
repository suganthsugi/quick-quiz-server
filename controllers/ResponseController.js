const QuestionPaper = require('../models/QuestionPaper');
const AnswerScript=require("../models/AnswerScripts");
const User=require("../models/User")
const Points=require("../Resources/Points");
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
    const oldresponse=await AnswerScript.findOne({user:uid,qnPaper:qid});
    const userData=await User.findOne({_id:uid});

    if(oldresponse!=null  && oldresponse.score>=score)
    {
        
        console.log("1");
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
        
        console.log("2");
    const percent=(score/totalScore)*100;
    const rate=await Points(percent,qset.mode);
        const q=await AnswerScript.updateOne({user:uid,qnPaper:qid},
            {
                user:uid,
                qnPaper:qid,
                type:qset.type,
                totalquestions:eachQuestion.length,
                correctanswers:correctCount,
                totalscore:totalScore,
                score,
                rating:rate,
                qnName:qset.topic,
             answers:answerscript

               });
               const newTest={
                user:uid,
                qnPaper:qid,
                type:qset.type,
                totalquestions:eachQuestion.length,
                correctanswers:correctCount,
                totalscore:totalScore,
                score,
                rating:rate,
                qnName:qset.topic
               };
               if(qset.type=="test")
               {
                const newrate=rate-oldresponse.rating;
               const newhistory=await User.updateOne({ _id:uid,'test.qnPaper': qid },
               { $set: { 'test.$.rating': rate,'test.$.score':score ,'test.$.correctanswers':correctCount},$inc:{Rating:newrate} });
            }
            else
            {
                const newhistory=await User.updateOne({ 'practice.qnPaper': qid },
                { $set: { 'practice.$.score':score } });
            }
          
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
    try
    {
        
        console.log("3");
    const percent=(score/totalScore)*100;
    var rating=await Points(percent,qset.mode);
   const newResponse =new AnswerScript({
    user:uid,
    qnPaper:qid,
    type:qset.type,
    totalquestions:eachQuestion.length,
    correctanswers:correctCount,
    totalscore:totalScore,
    score,
    rating,
    qnName:qset.topic,
    answers:answerscript
   })
   const newTest={
    user:uid,
    qnPaper:qid,
    type:qset.type,
    totalquestions:eachQuestion.length,
    correctanswers:correctCount,
    totalscore:totalScore,
    score,
    rating,
    qnName:qset.topic

   };
   if(qset.type=="test")
   {
    const newrate=rating-userData.Rating;
    console.log(newrate);
   const newhistory=await User.findByIdAndUpdate({ _id: uid },
   { $push: { test:newTest } ,$inc:{Rating:newrate},
   $inc: {
    "easy": qset.mode === "Easy" ? 1 : 0,
    "medium": qset.mode === "Medium" ? 1 : 0,
    "hard": qset.mode === "Hard" ? 1 : 0
  }});
}
else
{
    const newhistory=await User.findByIdAndUpdate({ _id: uid },
    { $push: { practice:newTest } , $inc: {
        "easy": qset.mode === "Easy" ? 1 : 0,
        "medium": qset.mode === "Medium" ? 1 : 0,
        "hard": qset.mode === "Hard" ? 1 : 0
      }});
}

   const respond=await newResponse.save(); 
   res.json({
    score,
    totalScore,
    correctCount,
    totalCount:eachQuestion.length
})
}
catch(err)
{
    console.log(err);
   res.json({
    score,
    totalScore,
    correctCount,
    totalCount:eachQuestion.length
})
}
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


exports.solutiondetails=async(req,res)=>{
    try 
    {
        const {qid,uid}=req.body;
        const q=await AnswerScript.findOne({user:uid,qnPaper:qid});
        const sol=await QuestionPaper.findOne({_id:qid});
        console.log(q);
        res.json({
            q,sol
        })


    }
    catch(err)
    {
        res.status(500).json({err});
    }
}