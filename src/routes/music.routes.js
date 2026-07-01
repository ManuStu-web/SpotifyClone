const express = require('express');

const musicController = require('../Controllers/music.controller');
const router = express.Router(); //to create upload api
const multer = require('multer'); //to read the uploaded files from user
const authMiddleware = require("../Middlewares/auth.middleware");

const upload = multer({
    storage:multer.memoryStorage()
});

router.post('/upload',authMiddleware.authArtist, upload.single("music") , musicController.createMusic);
router.post('/album', authMiddleware.authArtist, musicController.createAlbum);

module.exports = router;