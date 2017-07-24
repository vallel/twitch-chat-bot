var request = require('request');
var csv = require('csv');
var fs = require('fs');
var pointsDao = require('../data/points');
var appConfig = require('../config'),
    moment = require('moment'),
    chat = require('./chat');

var rank = {
    channelIntervals: {},

    init: function(channel) {
        rank.channelIntervals[channel] = setInterval(function() {
            var users = chat.getConnectedUsers(channel);
            rank.incrementPoints(channel, users);
        }, 60000);
    },

    stop: function(channel) {
        clearInterval(rank.channelIntervals[channel]);
    },

    incrementPoints: function(channel, users, increment, callback) {
        increment = increment || 1;
        for (var i = 0; i < users.length; i++) {
            rank.incrementUserPoints(channel, users[i], increment, false, callback);
        }
    },

    incrementUserPoints: function(channel, userName, increment, isGamble, callback) {
        pointsDao.increment(channel, userName.toLowerCase(), increment, isGamble, callback);
    },

    getPoints: function(channel, userName, callback) {
        this.getRankData(channel, userName.toLowerCase(), function (data) {
            var points = data && data.points ? data.points : 0;
            callback(points);
        });
    },

    getRankData: function(channel, userName, callback) {
        pointsDao.get(channel, userName, callback);
    },

    getRanking: function(channel, callback) {
        var noShowUsers = [appConfig.twitchChannel, appConfig.botOauth.username];
        pointsDao.getFiltered(channel, noShowUsers, callback);
    },

    importCsv: function(channel, filePath, callback) {
        fs.createReadStream(filePath).pipe(csv.parse({delimiter: ','}, function(error, data) {
            if (error) {
                console.log(error);
            } else {
                if (data) {
                    /*
                    * First row is ignored as is just headers.
                    * The supported file format is the Revlo export csv file:
                    * Username,Twitch User ID,Current Points,All Time Points
                    * */
                    for (var i = 1; i < data.length; i++) {
                        rank.incrementUserPoints(channel, data[i][0], data[i][2]);
                    }
                }

                fs.unlink(filePath);

                if (callback) {
                    callback();
                }
            }
        }));
    }
};

module.exports = rank;