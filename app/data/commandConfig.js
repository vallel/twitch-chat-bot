var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');
var channelDao = require('./channel');

var commandConfig = {
    get: function (channel, command, configKey, fn) {
        db.get("SELECT cc.* FROM commandConfigs cc JOIN channels c ON cc.channelId = c.id WHERE c.name = $channel AND cc.command = $command AND cc.key = $key;", {
            $channel: channel,
            $command: command,
            $key: configKey
        }, function(error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    createOrUpdate: function(channel, command, key, value, fn) {
        channelDao.get(channel, function (data) {
            if (data && data.id) {    
                db.run("INSERT OR REPLACE INTO commandConfigs (channelId, command, key, value) VALUES ($channelId, $command, $key, $value);", {
                    $channelId: data.id,
                    $command: command,
                    $key: key,
                    $value: value
                }, function (error) {
                    if (!error && fn) {
                        fn();
                    }
                });
            }
        });
    }
};

module.exports = commandConfig;