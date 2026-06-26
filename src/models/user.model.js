const mongoose = require('mongoose');

//Creating schema(structure) of database
const userSchema = new mongoose.Schema({

    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','artist'], //two types of roles allowed user and artist so use enum
        default:'user'
    }
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;