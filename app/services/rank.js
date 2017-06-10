var request = require('request');
var rankModel = require('../models/rank');

var rank = {
    init: function() {
        setInterval(function() {
            getConnectedUsers(function (users) {
                rank.incrementPoints(users);
            });
        }, 60000);
    },

    incrementPoints: function(users) {
        for (var i = 0; i < users.length; i++) {
            var data = {
                userName: users[i],
                $inc: {points: 1}
            };
            rankModel.update({userName: users[i]}, data, {upsert: true}, function(error) {
                if (error) {
                    console.log(error);
                }
            });
        }
    },

    getPoints: function(userName, callback) {
        console.log(userName);
        rankModel.findOne({userName: userName}, function(error, data) {
            console.log(error);
            if (!error && callback) {
                console.log(data);
                callback(data);
            }
        })
    }
};

function getConnectedUsers(callback) {
    var channel = 'vallelblanco'; // TODO : move this to a config file

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