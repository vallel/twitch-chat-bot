var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

var song = {
    add: function(songId, title, type, userName, query, fn) {
        db.run("INSERT INTO songs (songId, title, type, userName, query, date) " +
            "VALUES (?, ?, ?, ?, ?, strftime('%Y-%m-%d %H-%M-%f','now'));",
            [songId, title, type, userName, query],
            function(error) {
            if (!error && fn) {
                fn();
            }
        });
    },

    updateSkip: function(skips, songId, type, fn) {
        db.run("UPDATE songs SET skips = ? WHERE songId = ?, type = ?;", [
            JSON.stringify(skips),
            songId,
            type
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

    getAll: function(fn) {
        getOrdered(false, fn);
    },

    getNext: function(fn) {
        getOrdered(true, fn);
    },

    delete: function(songId, type, fn) {
        db.run("DELETE FROM songs WHERE songId = $songId AND type = $type;", {
            $songId: songId,
            $type: type
        }, function(error) {
            if (!error && fn) {
                fn();
            }
        });
    }
};

function getOrdered(single, fn) {
    var method = single ? 'get' : 'all';
    db[method]("SELECT * FROM songs ORDER BY date ASC;", function(error, data) {
        if (!error && fn) {
            fn(data);
        }
    });
}

module.exports = song;