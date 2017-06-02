var songModel = require('../models/song.js');

var songRequest = {
    addSong: function(userName, query, onSuccess) {
        var videoId = 'asd8f69a7df';
        var videoTitle = 'Pasito tún tún';

        var song = new songModel({
            title: videoTitle,
            videoId: videoId,
            requestedDate: new Date(),
            requestedBy: userName,
            requestQuery: query 
        });

        song.save(function(error) {
            console.log(error);
            if (!error && onSuccess) {
                onSuccess(videoTitle);
            }
        });
    }
};

module.exports = songRequest;