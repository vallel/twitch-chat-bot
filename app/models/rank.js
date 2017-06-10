var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RankSchema = new Schema({
    userName: String,
    points: Number
});

var Rank = mongoose.model('Rank', RankSchema);

module.exports = Rank;