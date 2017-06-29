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
        points.getFiltered([], fn);
    },

    getFiltered: function(filterUsers, fn) {
        filterUsers = filterUsers || [];
        var whereFilter = filterUsers.length ? " WHERE userName NOT IN ('"+ filterUsers.join("','") +"') " : "";

        db.all("SELECT * FROM points "+ whereFilter +" ORDER BY points DESC;",
            function(error, data) {
                if (!error && fn) {
                    fn(data);
                }
            }
        );
    },

    increment: function(userName, increment, isGamble, fn) {
        var gambleField = isGamble ? ", lastGamble " : "",
            gambleValue = isGamble ? ", DATETIME('now', 'localtime') " : "";
        db.run("INSERT OR REPLACE INTO points (userName, points "+ gambleField +") " +
            "VALUES ($userName, " +
            "COALESCE((SELECT points + $increment FROM points WHERE userName = $userName), $increment) " +
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