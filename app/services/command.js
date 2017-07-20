var commandDao = require('../data/command');
var cmdConfigDao = require('../data/commandConfig');

var command = {
    save: function(commandName, message, enabled, isDefault, callback) {
        commandName.replace(/\W/g, '');
        commandDao.createOrUpdate(commandName, message, enabled, isDefault, callback);
    },

    getAll: function (callback) {
        commandDao.getAll(callback);
    },

    getList: function (defaultCommands, callback) {
        var typeMethod = defaultCommands ? 'getDefault' : 'getCustom';
        commandDao[typeMethod](callback);
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