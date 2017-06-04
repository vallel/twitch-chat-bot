var songModel = require('../models/song');
var youtube = require('./youtube');

var songRequest = {
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
    }
};

module.exports = songRequest;