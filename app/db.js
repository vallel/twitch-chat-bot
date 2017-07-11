var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS points (userName TEXT PRIMARY KEY, points INTEGER, lastGamble TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS songs (songId TEXT, type TEXT, title TEXT, date TEXT, userName TEXT, query TEXT, skips TEXT, PRIMARY KEY (songId, type));");
    db.run("CREATE TABLE `commands` (`name`	TEXT, `message`	TEXT, `enabled`	INTEGER, `default`	INTEGER, PRIMARY KEY(`name`));");
    db.run("CREATE TABLE IF NOT EXISTS commandConfigs (command TEXT, key TEXT, value TEXT, PRIMARY KEY (command, key));");
});