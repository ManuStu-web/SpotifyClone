const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken'); //for creating tokens
const bcrypt = require('bcryptjs'); //for hashing the password

async function registerUser(req,res){

    //Take the given username , email , password and roles form request body
    const {username,email,password,role} = req.body;

    //before creating user , check wheather the user exist or not
    const userAlreadyExists = await userModel.findOne({
        $or:[{username},{email}]
    });

    //if exist then userAlreadyExists!=null then return already exist
    if(userAlreadyExists)
    {
        return res.status(409).json({
            message:"User Already Exists"
        });
    }

    //hash the password for security . 10 here is salt which means 10 times the hashing algo will work on password
    //plain text can be converted to hash , vice cersa not possible so it securest the DB even if breached
    const hash = await bcrypt.hash(password,10);

    //no user exist so create the user
    const user = await userModel.create({
        username,
        email,
        password:hash,
        role
    });

    //provide the token to the user
    const token = jwt.sign({
        id:user._id,    //at least 1 unique key is required and other may or may not be unique
        role:user.role
    },process.env.JWT_SECRET_KEY);

    res.cookie("token",token); //put the token in the cookies

    //now send the message user registered
    res.status(201).json({
        message:"User Registered",
        user:{
            id:user.id,
            username:user.username,
            email:user.email,
            role:user.role
        }
    });

}

async function loginUser(req,res){

    //take out the credentials user filled during login
    const {username , email , password} = req.body;

    //now check weather user exisit or not
    //here user may use username or email to login (only 1 at a time)
    //so one of the username or email will be undefined
    //so to find out the user we need to use--> $or

    const user = await userModel.findOne({
        $or:[{username},{email}]
    });

    //user is null, which means no user exist
    if(!user)
    {
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    //If code comes here so user exist
    //Now check the password entered
    //to check we use compare function so no need to use bcrypt.hash , .compare will do it by itself
    const isPasswordValid = await bcrypt.compare(password,user.password);
    //password here is the password entered during login
    //User.password is the password fetched from DB

    if(!isPasswordValid)
    {
        return res.status(401).json({
            message:"Invalid Password"
        });
    }

    //if password also correct , create the token for the user and set it into cookies
    const token = jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET_KEY);

    //put the token in cookie
    res.cookie("token",token);
    

    //message user that login successfull
    res.status(200).json({
        message:"user logged in successfully"
    })
}

module.exports = {registerUser,loginUser};