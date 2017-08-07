var songDao = require('../data/song');
var youtube = require('./youtube');

var songType = 'youtube';

var songRequest = {
    skipLimit: 3,

    addSong: function(channel, userName, query, onSuccess) {
        youtube.search(query, function(error, results) {
            if (error) {
                console.log(error);
            }
            else {
                if (results.items.length) {
                    var video = results.items[0],
                        title = video.snippet.title,
                        songId = video.id.videoId;

                    songDao.add(channel, songId, title, songType, userName, query, function() {
                        onSuccess(title);
                    });
                }
            }
        });
    },

    getSongs: function(channel, onSuccess) {
        songDao.getAll(channel, onSuccess);
    },

    getCurrentSong: function(channel, onSuccess) {
        songDao.getNext(channel, onSuccess);
    },

    deleteSong: function(id, onSuccess) {
        songDao.delete(id, function() {
            onSuccess(id);
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
        songDao.updateSkip(currentSong.id, currentSong.type, skips);
    }
};

module.exports = songRequest;