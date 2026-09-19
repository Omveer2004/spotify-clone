const musicModel = require('../model/music.model');
const albumModel = require('../model/album.model');
const { uploadFile } = require("../services/storage.services");

async function createMusic(req, res) {
    try {
        const { title } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Upload to ImageKit
        const uploadResult = await uploadFile(file.buffer, file.originalname);

        // Save to Database
        const music = await musicModel.create({
            title,
            uri: uploadResult.url,
            artist: req.user.id
        });

        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

async function createAlbum(req, res) {
    try {
        const { title, musics } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: Array.isArray(musics) ? musics : []
        });

        res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        });
    } catch (error) {
        console.error("Album creation error:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

async function getAllMusics(req, res) {
    try {
        const musics = await musicModel.find().limit(20).populate("artist", "username email");
        res.status(200).json({
            message: "Musics fetched successfully",
            musics
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel.find().populate("artist", "username email").populate("musics");
        res.status(200).json({
            message: "Albums fetched successfully",
            albums
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums };