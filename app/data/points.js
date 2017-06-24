var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

var points = {
    get: function (userName, fn) {
        db.get("SELECT * FROM points WHERE userName = ?", [userName], function(error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    getAll: function (fn) {
        db.all("SELECT * FROM points ORDER BY points DESC;", function(error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    increment: function(userName, increment, isGamble, fn) {
        var gambleField = isGamble ? ", lastGamble " : "",
            gambleValue = isGamble ? ", NOW() " : "";
        db.run("INSERT OR REPLACE INTO points (userName, points "+ gambleField +") " +
            "VALUES ($userName, " +
            "COALESCE((SELECT points + $increment FROM points WHERE userName = $userName), $increment), " +
            gambleValue +");", {
            $userName: userName,
            $increment: increment
        }, function (error) {
            if (!error && fn) {
                fn();
            }
        });
    }
};

module.exports = points;