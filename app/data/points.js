var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database(process.env.SQLITE_DB_PATH);
var channelDao = require('./channel')

var points = {
    get: function (channel, userName, fn) {
        db.get("SELECT * FROM points p INNER JOIN channels c ON p.channelId = c.id WHERE c.name = $channel AND p.userName = $user;", {
                $channel: channel,
                $user: userName
            }, function(error, data) {
                if (error) {
                    console.log(error);
                } else if (fn) {
                    fn(data);
                }
        });
    },

    getAll: function (channel, fn) {
        points.getFiltered(channel, [], fn);
    },

    getFiltered: function(channel, filterUsers, fn) {
        filterUsers = filterUsers || [];
        var whereFilter = filterUsers.length ? " AND userName NOT IN ('"+ filterUsers.join("','") +"') " : "";

        db.all("SELECT * FROM points p INNER JOIN channels c ON p.channelId = c.id WHERE c.name = $channel "+ whereFilter +" ORDER BY points DESC;", {
                $channel: channel
            }, function(error, data) {
                if (error) {
                    console.log(error);
                } else if (fn) {
                    fn(data);
                }
            }
        );
    },

    increment: function(channel, userName, increment, isGamble, fn) {
        channelDao.get(channel, function(data) {
            if (data) {
                var gambleField = isGamble ? ", lastGamble " : "",
                    gambleValue = isGamble ? ", DATETIME('now', 'localtime') " : "";
                
                db.run("INSERT OR REPLACE INTO points (channelId, userName, points "+ gambleField +") " +
                    "VALUES ($channelId, $userName, " +
                    "COALESCE((SELECT points + $increment FROM points WHERE userName = $userName), $increment) " +
                    gambleValue +");", {
                        $channelId: data.id,
                        $userName: userName,
                        $increment: increment
                }, function (error) {
                    if (error) {
                        console.log(error);
                    } else if (fn) {
                        fn();
                    }
                });
            }
        });
    }
};

module.exports = points;