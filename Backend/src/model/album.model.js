const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    // Array of Music IDs
    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music"
    }],
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, { timestamps: true });

const albumModel = mongoose.model("album", albumSchema);
module.exports = albumModel;