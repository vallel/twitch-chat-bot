var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommandSchema = new Schema({
    command: String,
    enabled: Boolean
});

var Command = mongoose.model('Command', CommandSchema);

module.exports = Command;