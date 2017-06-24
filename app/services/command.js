var commandDao = require('../data/command');
var cmdConfigDao = require('../data/commandConfig');

var command = {
    save: function(commandName, enabled, callback) {
        commandDao.createOrUpdate(commandName, enabled, callback);
    },

    get: function(commandName, callback) {
        commandDao.get(commandName, callback);
    },

    saveConfig: function(command, key, value, callback) {
        cmdConfigDao.createOrUpdate(command, key, value, callback);
    },

    getConfig: function(command, key, callback) {
        cmdConfigDao.get(command, key, callback)
    }
};

module.exports = command;