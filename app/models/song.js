var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SongSchema = new Schema({
    title: String,
    videoId: String,
    date: Date,
    userName: String,
    query: String
});

var Song = mongoose.model('Song', SongSchema);

module.exports = Song;