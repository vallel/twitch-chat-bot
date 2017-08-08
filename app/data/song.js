var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db'),
    channelDao = require('./channel');

var song = {
    add: function(channel, songId, title, type, userName, query, fn) {
        channelDao.get(channel, function(data) {
            db.run("INSERT INTO songs (channelId, songId, title, type, userName, query, date) " +
                "VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'));",
                [data.id, songId, title, type, userName, query],
                function(error) {
                    if (!error && fn) {
                        fn();
                    }
            });
        });
    },

    updateSkip: function(id, skips, fn) {
        db.run("UPDATE songs SET skips = ? WHERE id = ?;", [
            JSON.stringify(skips),
            id
        ], function(error) {
            if (!error && fn) {
                fn();
            }
        });
    },

    getBySongId: function(songId, fn) {
        db.get("SELECT * FROM songs WHERE songId = ?;", [songId], function(error, data) {
            if (!error && fn) {
                fn(data);
            }
        });
    },

    getAll: function(channel, fn) {
        getOrdered(channel, false, fn);
    },

    getNext: function(channel, fn) {
        getOrdered(channel, true, fn);
    },

    delete: function(id, fn) {
        db.run("DELETE FROM songs WHERE id = $id;", {
            $id: id
        }, function(error) {
            if (error) {
                console.log(error);
            } else if (fn) {
                fn();
            }
        });
    }
};

function getOrdered(channel, single, fn) {
    var method = single ? 'get' : 'all';
    channelDao.get(channel, function(channelData) {
        db[method]("SELECT * FROM songs WHERE channelId = $channelId ORDER BY date ASC;", {
            $channelId: channelData.id
        }, function(error, data) {
            if (error) {
                console.log(error);
            } else if (fn) {
                fn(data);
            }
        });
    });
}

module.exports = song;