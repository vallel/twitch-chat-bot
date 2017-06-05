var songRequest = require('../services/songRequest');

exports.songsList = function(req, res, next) {
    songRequest.getSongs(function(songs) {
        res.render('songrequest', {
            title: 'Twitch Chat Bot - Song Request',
            songRequestPage: true,
            songs: songs,
            currentSong: songs ? songs[0] : null
        });
    });
};

exports.deleteSong = function(req, res, next) {
    songRequest.deleteSong(req.body.songId, function() {
       res.json({success: true});
    });
};

exports.getSongs = function(req, res, next) {
    songRequest.getSongs(function(songs) {
        res.json(songs);
    });
};