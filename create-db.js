var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS channels ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `name` TEXT NOT NULL UNIQUE, `active` INTEGER NOT NULL DEFAULT 0, `email` TEXT )");
    db.run("CREATE TABLE IF NOT EXISTS points ( `channelId` INTEGER NOT NULL, `userName` TEXT, `points` INTEGER, `lastGamble` TEXT, PRIMARY KEY(`channelId`,`userName`) )");
    db.run("CREATE TABLE IF NOT EXISTS songs (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `channelId` INTEGER NOT NULL, `songId` TEXT, `type` TEXT, `title` TEXT, `date` TEXT, `userName` TEXT, `query` TEXT, `skips` TEXT );");
    db.run("CREATE TABLE IF NOT EXISTS commands ( `channelId` INTEGER NOT NULL, `name` TEXT NOT NULL, `message` TEXT, `enabled` INTEGER, `default` INTEGER DEFAULT 0, PRIMARY KEY(`channelId`,`name`) )");
    db.run("CREATE TABLE IF NOT EXISTS commandConfigs ( `channelId` INTEGER NOT NULL, `command` TEXT, `key` TEXT, `value` TEXT, PRIMARY KEY(`channelId`,`command`,`key`) )");
});