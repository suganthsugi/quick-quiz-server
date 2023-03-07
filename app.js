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
app.use(cors());
app.use(cookieParser());
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
// app.use(function (req, res, next) {
//     const allowedOrigins = ['http://localhost:3000', 'https://quickquiz-bc991.firebaseapp.com']; // update with your own domain
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
//     next();
// });
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000', 'https://quickquiz-bc991.firebaseapp.com']; // update with your own domain
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
// app.use((req, res, next) => {
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     // res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Origin', 'https://quickquiz-bc991.firebaseapp.com');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     // res.header()
//     next();
//   });
  
  

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
