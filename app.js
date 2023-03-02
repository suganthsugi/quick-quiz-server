require('dotenv').config()
const express = require('express');

const app = express()

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server started at http://127.0.0.1:${PORT}`);
});
