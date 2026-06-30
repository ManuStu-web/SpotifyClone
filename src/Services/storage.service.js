const {ImageKit} = require('@imagekit/nodejs'); //import image kit 

const imageKitClient = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY //initalize private key
})

async function uploadFile(file)
{
    const result = await imageKitClient.files.upload({
        file,
        fileName:"music_"+Date.now(),
        folder:"Spotify/music"
    });

    return result;
}

module.exports = {uploadFile};