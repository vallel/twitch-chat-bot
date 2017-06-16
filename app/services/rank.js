var request = require('request');
var csv = require('csv');
var fs = require('fs');
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

    incrementPoints: function(users, increment, callback) {
        increment = increment || 1;
        for (var i = 0; i < users.length; i++) {
            incrementUserPoints(users[i], increment, callback);
        }

    },

    getPoints: function(userName, callback) {
        rankModel.findOne({userName: userName.toLowerCase()}, function(error, data) {
            if (!error && data && callback) {
                var points = data.points || 0;
                callback(points);
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
    },

    importCsv: function(filePath, callback) {
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
                        incrementUserPoints(data[i][0], data[i][2]);
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

function incrementUserPoints(userName, increment, callback) {
    var data = {
        userName: userName,
        $inc: {points: increment}
    };
    rankModel.update({userName: userName}, data, {upsert: true}, function(error) {
        if (error) {
            console.log(error);
        } else {
            if (callback) {
                callback();
            }
        }
    });
}

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