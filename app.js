require('dotenv').config();
const express = require('express');

const app = express();

// const conn = require('./db')

// importing routers
const AuthRouter = require('./routes/AuthRoute');

app.use(express.json({limit : '10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/accounts', AuthRouter);


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server started at http://127.0.0.1:${PORT}`);
});
