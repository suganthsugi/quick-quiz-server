require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

require('./db');

// importing routers
const AuthRouter = require('./routes/AuthRoute');
const UserRoute = require('./routes/UserRoute');
const QuestionRoute = require('./routes/QuestionRoute');
const CourseRoute = require('./routes/CourseRoute');

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors());
app.use(cookieParser());
app.use(function (req, res, next) {
    const allowedOrigins = ['*'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/accounts', AuthRouter);
app.use('/user', UserRoute);
app.use('/question', QuestionRoute);
app.use('/course', CourseRoute);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started at http://127.0.0.1:${PORT}`);
});
