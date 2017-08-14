var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database(process.env.SQLITE_DB_PATH);

var channel = {
    add: function(channelName, email, active, fn) {
        active = active || 0;
        db.run("INSERT OR IGNORE INTO channels (name, email, active) VALUES ($channel, $email, $active);", {
            $channel: channelName,
            $email: email,
            $active: active
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