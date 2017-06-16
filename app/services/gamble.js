var rank = require('./rank');

var gamble = {
    run: function(userName, points, callback) {
        var result = Math.round(Math.random() * 100),
            factor = 0;
        if (result <= 60) {
            factor = -1;
        } else if (result > 60 && result < 98) {
            factor = 2;
        } else if (result > 98) {
            factor = 3;
        }

        if (factor !== 0) {
            var newPoints = points * factor;
            rank.incrementPoints([userName], newPoints, function() {
                rank.getPoints(userName, function(currentPoints) {
                    if (callback) {
                        var win = factor > 0;
                        callback(result, win, Math.abs(newPoints), currentPoints);
                    }
                });
            });
        }
    }
};

module.exports = gamble;