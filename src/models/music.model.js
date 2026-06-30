const mongoose = require('mongoose');

//creating Schema for music
const musicSchema = new mongoose.Schema({
    uri:{   //song url
        type:String, 
        required:true
    },
    title:{ //title of song
        type:String,
        required:true
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId, //it means store the ID of another MongoDB document here
        ref:"user", //that ID will belong to "user" model
        require:true
    }
})

const musicModel = mongoose.model('music' , musicSchema);

module.exports = musicModel;