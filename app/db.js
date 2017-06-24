var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('twitchBot.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS points (userName TEXT, points INTEGER, lastGamble NUMERIC);");
    db.run("CREATE TABLE IF NOT EXISTS songs (songId TEXT, type TEXT, title TEXT, date NUMERIC, userName TEXT, query TEXT, skips TEXT);");
    db.run("CREATE TABLE IF NOT EXISTS commands (name TEXT, enabled INTEGER);");
    db.run("CREATE TABLE IF NOT EXISTS commandConfigs (command TEXT, key TEXT, value TEXT);");
});