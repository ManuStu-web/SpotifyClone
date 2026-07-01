const musicModel = require('../models/music.model');
const { uploadFile } = require('../Services/storage.service');
const albumModel = require('../models/album.model');

async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No music file provided' });
    }

    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
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
            artist: req.user.id
        });

        return res.status(201).json({ message: 'Uploaded', uri: uploadedUri });
    } catch (err) {
        return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
}

async function createAlbum(req, res) {
    const { title, musicIds } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const album = await albumModel.create({
            title,
            artist: req.user.id,
            music: Array.isArray(musicIds) ? musicIds : (musicIds ? [musicIds] : [])
        });

        return res.status(201).json({ message: 'created', album });
    } catch (err) {
        console.error('createAlbum error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

module.exports = { createMusic, createAlbum };