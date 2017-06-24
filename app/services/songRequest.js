var songDao = require('../data/song');
var youtube = require('./youtube');

var songType = 'youtube';

var songRequest = {
    skipLimit: 3,

    addSong: function(userName, query, onSuccess) {
        youtube.search(query, function(error, results) {
            if (error) {
                console.log(error);
            }
            else {
                if (results.items.length) {
                    var video = results.items[0],
                        videoTitle = video.snippet.title,
                        videoId = video.id.videoId;

                    songDao.add(videoId, videoTitle, songType, userName, query, function() {
                        onSuccess(videoTitle);
                    });
                }
            }
        });
    },

    getSongs: function(onSuccess) {
        songDao.getAll(onSuccess);
    },

    getCurrentSong: function(onSuccess) {
        songDao.getNext(onSuccess);
    },

    deleteSong: function(songId, onSuccess) {
        songDao.delete(songId, songType, function() {
            onSuccess(songId);
        });
    },

    setVolume: function(socket, volume) {
        if (socket && volume) {
            volume = volume >= 0 && volume <= 100 ? volume : null;
            if (volume) {
                socket.emit('!volume', volume);
            }
        }
    },

    updateSong: function(currentSong, skips) {
        songDao.updateSkip(currentSong.songId, currentSong.type, skips);
    }
};

module.exports = songRequest;