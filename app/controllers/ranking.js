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