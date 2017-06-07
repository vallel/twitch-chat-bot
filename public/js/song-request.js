var twitchBot = twitchBot || {};

(function($) {
    twitchBot.songRequest = {
        deleteCurrentSong: function(callback) {
            var songId = twitchBot.songRequest.getCurrentSongId();

            $.ajax({
                url: '/songrequest/delete-song',
                data: {songId: songId},
                dataType: 'json',
                method: 'post',
                success: function(response) {
                    if(response.success && callback) {
                        callback();
                    }
                }
            });
        },

        getCurrentSongId: function() {
            return $('.js-current-song-container').attr('data-song-id');
        },

        getSongs: function(callback) {
            $.ajax({
                url: '/songrequest/songs',
                dataType: 'json',
                success: function(response) {
                    callback(response)
                }
            });
        },

        updateCurrentSong: function(callback) {
            var self = twitchBot.songRequest;

            self.deleteCurrentSong(function () {
                self.updatePlayList(function(songs) {
                    if (songs.length > 0) {
                        var currentSong = songs[0],
                            $currentSongContainer = $('.js-current-song-container'),
                            userLink = '<a href="http://twitch.tv/'+ currentSong.userName +'">'+ currentSong.userName +'</a>';

                        $currentSongContainer.attr('data-song-id', currentSong._id);
                        $currentSongContainer.find('.js-current-song-title').html(currentSong.title);
                        $currentSongContainer.find('.js-current-song-username').html(userLink);
                        $currentSongContainer.find('.js-current-song-date').html(currentSong.date);

                        if (callback) {
                            callback(currentSong);
                        }
                    }
                });
            });
        },

        updatePlayList: function (callback) {
            twitchBot.songRequest.getSongs(function(songs) {
                var $tableBody = $('.js-song-request-playlist').find('tbody'),
                    songsHtml = '';

                $.each(songs, function(i, song) {
                    var activeClass = i == 0 ? ' active ' : '',
                        isPlayingIcon = i == 0 ? '' : ' hidden ',
                        $template = $('.js-playlist-song-template').find('tbody'),
                        songHtml = $template.clone().html();

                    songHtml = songHtml.replace('{activeClass}', activeClass);
                    songHtml = songHtml.replace('{isPlayingIcon}', isPlayingIcon);
                    songHtml = songHtml.replace('{title}', song.title);
                    songHtml = songHtml.replace(new RegExp('{userName}', 'g'), song.userName);
                    songHtml = songHtml.replace('{date}', song.date);
                    songHtml = songHtml.replace('{id}', song.id);

                    songsHtml += songHtml;
                });

                $tableBody.html(songsHtml);

                if (callback) {
                    callback(songs);
                }
            });
        }
    };
})(jQuery);