var rank = require('../services/rank');

exports.rankingList = function(req, res, next) {
    rank.getRanking(function(rankingList) {
        res.render('ranking', {
            title: 'Twitch Chat Bot - Puntos',
            rankingPage: true,
            rankingList: rankingList
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