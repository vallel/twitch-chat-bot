var rank = require('./rank'),
    moment = require('moment'),
    command = require('./command');

var gamble = {
    run: function(userName, points, callback) {
        rank.getRankData(userName, function(rankData) {
            command.getConfig('gamble', 'cooldown', function(config) {
                var gambleCooldown = config && config.value != undefined ? config.value : 0;

                if (!rankData.lastGamble || moment() >= moment(rankData.lastGamble).add(gambleCooldown, 'm')) {
                    var currentPoints = rankData.points || 0;
                    userName = userName.toLowerCase();
                    if (currentPoints >= points) {
                        var result = Math.round(Math.random() * 100),
                            factor = 0;
                        if (result <= 60) {
                            factor = -1;
                        } else if (result > 60 && result < 98) {
                            factor = 1;
                        } else if (result > 98) {
                            factor = 2;
                        }

                        if (factor !== 0) {
                            var newPoints = points * factor;
                            rank.incrementUserPoints(userName, newPoints, true, function () {
                                rank.getPoints(userName, function (currentPoints) {
                                    if (callback) {
                                        var win = factor > 0;
                                        callback(result, win, Math.abs(newPoints), currentPoints);
                                    }
                                });
                            });
                        }
                    } else {
                        callback(-1);
                    }
                } else {
                    var waitTime = Math.ceil(moment(rankData.lastGamble).add(gambleCooldown, 'm').diff(moment(), 'minutes'));
                    callback(0, false, 0, 0, waitTime);
                }
            });
        });


    }
};

module.exports = gamble;