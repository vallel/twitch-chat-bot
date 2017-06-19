var rank = require('../services/rank');
var command = require('../services/command');

exports.rankingList = function(req, res, next) {
    rank.getRanking(function(rankingList) {
        command.get('gamble', function(data) {
            command.getConfig('gamble', 'cooldown', function(config) {
                var gambleCooldown = config && config.value != undefined ? config.value : 0;

                res.render('ranking', {
                    title: 'Twitch Chat Bot - Puntos',
                    rankingPage: true,
                    rankingList: rankingList,
                    gambleEnabled: data.enabled,
                    gambleCooldown: gambleCooldown
                });
            });
        });
    });
};

exports.import = function(req, res, next) {
    res.render('rankingImport');
};

exports.importCsv = function(req, res, next) {
    if (req.file) {
        rank.importCsv(req.file.path, function() {
            res.redirect('/puntos');
        });
    } else {
        res.redirect('/puntos/importar');
    }
};