var request = require('request');
var rankModel = require('../models/rank');
var appConfig = require('../config');

var rank = {
    init: function() {
        setInterval(function() {
            getConnectedUsers(function (users) {
                rank.incrementPoints(users);
            });
        }, 60000);
    },

    incrementPoints: function(users, increment) {
        increment = increment || 1;
        for (var i = 0; i < users.length; i++) {
            var data = {
                userName: users[i],
                $inc: {points: increment}
            };
            rankModel.update({userName: users[i]}, data, {upsert: true}, function(error) {
                if (error) {
                    console.log(error);
                }
            });
        }
    },

    getPoints: function(userName, callback) {
        rankModel.findOne({userName: userName}, function(error, data) {
            if (!error && callback) {
                callback(data);
            }
        })
    },

    getRanking: function(callback) {
        var noShowUsers = [appConfig.twitchChannel, appConfig.botOauth.username];
        rankModel.find({userName: {$nin: noShowUsers}})
            .sort({points: 'desc'})
            .exec(function (error, data) {
                if (!error && callback) {
                    callback(data);
                }
        });
    }
};

function getConnectedUsers(callback) {
    var channel = appConfig.twitchChannel;

    request({
        url: 'https://tmi.twitch.tv/group/user/'+channel+'/chatters',
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var users = [];

            if (body.chatters) {
                for (var userType in body.chatters) {
                    var userNames = body.chatters[userType];
                    for (var i = 0; i < userNames.length; i++) {
                        users.push(userNames[i]);
                    }
                }
            }

            callback(users);
        }
    });
}

module.exports = rank;