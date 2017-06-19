var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommandConfigSchema = new Schema({
    command: String,
    key: String,
    value: String
});

var CommandConfig = mongoose.model('CommandConfig', CommandConfigSchema);

module.exports = CommandConfig;