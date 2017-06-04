var songRequest = require('../services/songRequest');

exports.songs_list = function(req, res, next) {
    songRequest.getSongs(function(songs) {
        console.log(songs);
        res.render('songrequest', {
            title: 'Twitch Chat Bot - Song Request',
            songRequestPage: true,
            songs: songs
        });
    });
};