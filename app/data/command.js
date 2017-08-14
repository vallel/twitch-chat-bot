var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database(process.env.SQLITE_DB_PATH);
var channelDao = require('./channel');

var command = {
    get: function (channel, name, fn) {
        db.get("SELECT c.* FROM commands c JOIN channels ch ON c.channelId = ch.id WHERE ch.name = $channel AND c.name = $command", {
                $channel: channel,
                $command: name
            }, function(error, data) {
                if (error) {
                    console.log(error);
                } else if (fn) {
                    fn(data);
                }
            }
        );
    },

    getAll: function (channel, fn) {
        db.all("SELECT c.* FROM commands c JOIN channels ch ON c.channelId = ch.id WHERE ch.name = $channel ORDER BY `default` DESC;", {
                $channel: channel
            }, function (error, data) {
                if (error) {
                    console.log(error);
                } else if (fn) {
                    fn(data);
                }
        });
    },

    getDefault: function(channel, fn) {
        db.all("SELECT c.* FROM commands c JOIN channels ch ON c.channelId = ch.id WHERE ch.name = $channel AND `default` = 1 ORDER BY `default` DESC;", {
                $channel: channel
            }, function (error, data) {
                if (error) {
                    console.log(error);
                } else if (fn) {
                    fn(data);
                }
        });
    },

    getCustom: function(channel, fn) {
        db.all("SELECT c.* FROM commands c JOIN channels ch ON c.channelId = ch.id WHERE ch.name = $channel AND c.`default` = 0 OR c.`default` IS NULL ORDER BY `default` DESC;", {
                $channel: channel
            },function (error, data) {
                if (error) {
                    console.log(error);
                } else if (fn) {
                    fn(data);
                }
        });
    },

    createOrUpdate: function(channel, name, message, enabled, isDefault, fn) {
        channelDao.get(channel, function(data) {
            if (data && data.id) {
                db.run("INSERT OR REPLACE INTO commands (channelId, name, message, enabled, `default`) VALUES ($channelId, $name, $message, $enabled, $default);", {
                        $channelId: data.id,
                        $name: name,
                        $message: message,
                        $enabled: enabled,
                        $default: isDefault
                    }, function (error) {
                        if (error) {
                            console.log(error);
                        } else if (fn) {
                            fn();
                        }
                });
            }
        });
    },

    delete: function(channel, name, fn) {
        channelDao.get(channel, function(channelData) {
            db.run("DELETE FROM commands WHERE channelId = $channelId AND name = $name AND `default` = 0;", {
                $channelId: channelData.id,
                $name: name
            }, function(error) {
                if (error) {
                    console.log(error);
                } else if (fn) {
                    fn();
                }
            });
        });
    }
};

module.exports = command;