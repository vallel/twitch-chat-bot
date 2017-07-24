var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

var channel = {
    add: function(channelName, fn) {
        db.run("INSERT OR IGNORE INTO channels (name) VALUES ($channel);", {
            $channel: channelName
        }, function (error) {
            if (error) {
                console.log(error);
            } else if (fn) {
                fn();
            }
        });
    },

    get: function(channelName, fn) {
        db.get("SELECT * FROM channels WHERE name = $channel;", {
            $channel: channelName
        }, function (error, data) {
            if (error) {
                console.log(error);
            } else if (fn) {
                fn(data);
            }
        });
    }
};

module.exports = channel;