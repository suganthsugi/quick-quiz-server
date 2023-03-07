require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

require('./db');

// importing routers
const AuthRouter = require('./routes/AuthRoute');
const UserRoute = require('./routes/UserRoute');
const QuestionRoute = require('./routes/QuestionRoute');
const CourseRoute = require('./routes/CourseRoute');

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "https://quickquiz-bc991.firebaseapp.com",
  })
);


app.use('/accounts', AuthRouter);
app.use('/user', UserRoute);
app.use('/question', QuestionRoute);
app.use('/course', CourseRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started at http://127.0.0.1:${PORT}`);
});

// example route to access the cookie
app.get('/', (req, res) => {
    const token = req.cookies.jwt_token;
    console.log('Token:', token);
    res.send('Hello World!');
});
