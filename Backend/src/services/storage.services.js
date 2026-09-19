const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileBuffer, fileName) {
    // In @imagekit/nodejs v7+, upload is under .files.upload
    return await imagekit.files.upload({
        file: fileBuffer.toString("base64"),
        fileName: fileName,
        folder: "/yt-complete-backend/music",
    });
}

module.exports = { uploadFile };