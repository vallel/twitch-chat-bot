var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

var commandConfig = {
    get: function (command, configKey, fn) {
        db.get("SELECT * FROM commandConfigs WHERE command = $command AND key = $key;", {
            $command: command,
            $key: configKey
        }, function(error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    createOrUpdate: function(command, key, value, fn) {
        db.run("INSERT OR REPLACE INTO commandConfigs (command, key, value) VALUES ($command, $key, $value);", {
            $command: command,
            $key: key,
            $value: value
        }, function (error) {
            if (!error && fn) {
                fn();
            }
        });
    }
};

module.exports = commandConfig;