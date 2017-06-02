var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SongSchema = new Schema({
    title: String,
    videoId: String,
    requestedDate: Date,
    requestedBy: String,
    requestQuery: String 
});

var Song = mongoose.model('Song', SongSchema);

module.exports = Song;