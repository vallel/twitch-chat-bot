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

    createOrUpdate: function(name, enabled, fn) {
        db.run("INSERT OR REPLACE INTO commands (name, enabled) VALUES ($name, $enabled);", {
            $name: name,
            $enabled: enabled
        }, function (error) {
            if (!error && fn) {
                fn();
            }
        });
    }
};

module.exports = command;