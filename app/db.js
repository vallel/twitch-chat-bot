var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS `channels` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL UNIQUE )");
    db.run("CREATE TABLE IF NOT EXISTS points ( `channelId` INTEGER NOT NULL, `userName` TEXT, `points` INTEGER, `lastGamble` TEXT, PRIMARY KEY(`channelId`,`userName`) )");
    db.run("CREATE TABLE IF NOT EXISTS songs (songId TEXT, type TEXT, title TEXT, date TEXT, userName TEXT, query TEXT, skips TEXT, PRIMARY KEY (songId, type));");
    db.run("CREATE TABLE IF NOT EXISTS commands ( `channelId` INTEGER NOT NULL, `name` TEXT NOT NULL, `message` TEXT, `enabled` INTEGER, `default` INTEGER DEFAULT 0, PRIMARY KEY(`channelId`,`name`) )");
    db.run("CREATE TABLE IF NOT EXISTS commandConfigs ( `channelId` INTEGER NOT NULL, `command` TEXT, `key` TEXT, `value` TEXT, PRIMARY KEY(`channelId`,`command`,`key`) )");
});