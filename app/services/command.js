var commandModel = require('../models/command');

var command = {
    save: function(commandName, enabled, callback) {
        var data = {
            command: commandName,
            enabled: enabled
        };
        commandModel.update({command: commandName}, data, {upsert: true}, function(error) {
            if (!error && callback) {
                callback();
            }
        });
    },

    get: function(commandName, callback) {
        commandModel.findOne({command: commandName}, function (error, data) {
            if (!error && callback) {
                callback(data);
            }
        });
    }
};

module.exports = command;