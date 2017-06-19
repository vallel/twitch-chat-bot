var commandModel = require('../models/command');
var cmdConfigModel = require('../models/commandConfig');

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
    },

    saveConfig: function(command, key, value, callback) {
        var data = {
            command: command,
            key: key,
            value: value
        };
        cmdConfigModel.update({command: command}, data, {upsert: true}, function (error) {
            if (!error && callback) {
                callback();
            }
        });
    },

    getConfig: function(command, key, callback) {
        cmdConfigModel.findOne({command: command, key: key}, function (error, data) {
            if (!error && callback) {
                callback(data);
            }
        });
    }
};

module.exports = command;