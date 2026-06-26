const dns = require('dns');
const mongoose = require('mongoose');
dns.setServers(["8.8.8.8","8.8.4.4"]);
async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected")
    }catch(err){
        console.log('error to connect',err);
    }
}

module.exports = connectDB;