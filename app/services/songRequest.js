var songModel = require('../models/song');
var youtube = require('./youtube');

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

                    var song = new songModel({
                        title: videoTitle,
                        videoId: videoId,
                        date: new Date(),
                        userName: userName,
                        query: query
                    });

                    song.save(function(error) {
                        if (error) {
                            console.log(error);
                        }
                        else if (onSuccess) {
                            onSuccess(videoTitle);
                        }
                    });
                }
            }
        });
    },

    getSongs: function(onSuccess) {
        songModel.find().exec(function(error, songs) {
            if (error) {
                console.log(error);
            }
            else if (onSuccess) {
                onSuccess(songs);
            }
        });
    },

    getCurrentSong: function(onSuccess) {
        this.getSongs(function(songs) {
            onSuccess(songs ? songs[0] : null);
        })
    },

    deleteSong: function(songId, onSuccess) {
        songModel.findByIdAndRemove(songId, function (error) {
            if (error) {
                console.log(error);
            }
            else if(onSuccess) {
                onSuccess(songId);
            }
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

    updateSong: function(currentSong, data) {
        data = data || currentSong;

        console.log(currentSong._id);
        songModel.findById(currentSong._id, function (error, song) {
            if (!error) {
                song.skips = currentSong.skips;
                song.save();
            }
        });
    }
};

module.exports = songRequest;