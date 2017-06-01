var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SongSchema = new Schema({
    title : String,
    id : String,
    requested_date : Date,
    requested_by : String,
    request_query : String 
});

var Song = mongoose.model('Song', SongSchema);