var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RankSchema = new Schema({
    twitchUserId: Number,
    userName: String,
    points: Number
});

var Rank = mongoose.model('Rank', RankSchema);

module.exports = Rank;