const jwt = require('jsonwebtoken');
const musicModel = require('../models/music.model');
const { uploadFile } = require('../Services/storage.service');
const albumModel = require('../models/album.model');

async function createMusic(req, res) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decoded.role !== 'artist') {
            return res.status(403).json({ message: 'Not allowed' });
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No music file provided' });
    }

    try {
        const result = await uploadFile(file.buffer.toString('base64'));
        const uploadedUri = result?.url || result?.uri || result?.filePath;

        if (!uploadedUri) {
            return res.status(500).json({ message: 'Upload failed', error: 'No file URL returned from storage service' });
        }

        await musicModel.create({
            uri: uploadedUri,
            title,
            artist: decoded.id
        });

        return res.status(201).json({ message: 'Uploaded', uri: uploadedUri });
    } catch (err) {
        return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
}

async function createAlbum(req,res){
    const token = req.cookies.token;

    if(!token)
    {
        res.status(401).json({message:"Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(decoded.role!=="artist")
        {
            return res.status(403).json({message:"Don't hace access"});
        }

        const {title,musicIds} = req.body;
        const album = await albumModel.create({
            title,
            artist:decoded.id,
            music:musicIds
        });

        res.status(201).json({message:"created"});
    }
    catch(err)
    {
        res.status(401).json({message:"error"});
        console.log(err);
    }
}

module.exports = { createMusic };