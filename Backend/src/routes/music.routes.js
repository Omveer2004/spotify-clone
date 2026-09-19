const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware")
const musicController = require('../controllers/music.controllers')
const multer = require("multer")


const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
})

router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic);
router.post('/album', authMiddleware.authArtist, musicController.createAlbum);

router.get("/", authMiddleware.authUser, musicController.getAllMusics);
router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums)


module.exports = router;
