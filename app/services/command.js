var commandDao = require('../data/command');
var cmdConfigDao = require('../data/commandConfig');

var command = {
    save: function(channel, commandName, message, enabled, isDefault, callback) {
        commandName.replace(/\W/g, '');
        commandDao.createOrUpdate(channel, commandName, message, enabled, isDefault, callback);
    },

    getAll: function (channel, callback) {
        commandDao.getAll(channel, callback);
    },

    getList: function (channel, defaultCommands, callback) {
        var typeMethod = defaultCommands ? 'getDefault' : 'getCustom';
        commandDao[typeMethod](channel, callback);
    },

    get: function(channel, commandName, callback) {
        commandDao.get(channel, commandName, callback);
    },

    saveConfig: function(channel, command, key, value, callback) {
        cmdConfigDao.createOrUpdate(channel, command, key, value, callback);
    },

    getConfig: function(channel, command, key, callback) {
        cmdConfigDao.get(channel, command, key, callback)
    },

    delete: function(channel, commandName, callback) {
        commandDao.delete(channel, commandName, callback);
    }
};

module.exports = command;