require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

require('./db')

// importing routers
const AuthRouter = require('./routes/AuthRoute');

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/accounts', AuthRouter);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started at http://127.0.0.1:${PORT}`);
});
