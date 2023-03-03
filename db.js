const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.mx2xjqo.mongodb.net/?retryWrites=true&w=majority");
const conn = mongoose.connection;

conn.on('open', ()=>{
    console.log('Database Connected...');
});

module.exports = conn;