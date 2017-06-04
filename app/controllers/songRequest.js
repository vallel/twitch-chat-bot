var songRequest = require('../services/songRequest');

exports.songs_list = function(req, res, next) {
    songRequest.getSongs(function(songs) {
        res.render('songrequest', {
            title: 'Twitch Chat Bot - Song Request',
            songRequestPage: true,
            songs: songs,
            currentSong: songs ? songs[0] : null
        });
    });
};

exports.delete_song = function(req, res, next) {
    songRequest.deleteSong(req.params.id);
    res.redirect('/songrequest');
};