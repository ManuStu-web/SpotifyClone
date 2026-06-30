const express = require('express');

const musicController = require('../Controllers/music.controller');
const router = express.Router(); //to create upload api
const multer = require('multer'); //to read the uploaded files from user

const upload = multer({
    storage:multer.memoryStorage()
});

router.post('/upload', upload.single("music") , musicController.createMusic);

module.exports = router;