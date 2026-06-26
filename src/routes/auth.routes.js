const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.controller');

//creating api /register with logic written in controller folder
router.post('/register', authController.registerUser);

//creating api /login with logic written in controller folder
router.post('/login' , authController.loginUser);

module.exports = router;