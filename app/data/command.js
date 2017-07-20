var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

var command = {
    get: function (name, fn) {
        db.get("SELECT * FROM commands WHERE name = ?", [name], function(error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    getAll: function (fn) {
        db.all("SELECT * FROM commands ORDER BY `default` DESC;", function (error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    getDefault: function(fn) {
        db.all("SELECT * FROM commands WHERE `default` = 1 ORDER BY `default` DESC;", function (error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    getCustom: function(fn) {
        db.all("SELECT * FROM commands WHERE `default` = 0 or `default` IS NULL ORDER BY `default` DESC;", function (error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    createOrUpdate: function(name, message, enabled, isDefault, fn) {
        db.run("INSERT OR REPLACE INTO commands (name, message, enabled, `default`) VALUES ($name, $message, $enabled, $default);", {
            $name: name,
            $message: message,
            $enabled: enabled,
            $default: isDefault
        }, function (error) {
            if (!error && fn) {
                fn();
            }
        });
    }
};

module.exports = command;