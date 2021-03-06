var twitchBot = twitchBot || {};

(function($) {
    twitchBot.songRequest = {
        init: function () {
            wireEvents();
        },

        deleteCurrentSong: function(callback) {
            var songId = twitchBot.songRequest.getCurrentSongId();
            twitchBot.songRequest.deleteSong(songId, callback);
        },

        deleteSong: function (id, callback) {
            $.ajax({
                url: '/songrequest/delete-song',
                data: {id: id},
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

                        $currentSongContainer.attr('data-song-id', currentSong.id);
                        $currentSongContainer.find('.js-current-song-title').html(currentSong.title);
                        $currentSongContainer.find('.js-current-song-username').html(userLink);
                        $currentSongContainer.find('.js-current-song-date').html(currentSong.date);
                        $currentSongContainer.removeClass('hidden');

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

    function wireEvents() {
        $('.js-song-request-skip').click(twitchBot.youtube.skipSong);
        $('.js-song-request-playlist').on('click', '.js-song-request-delete', deleteSong);
    }

    function deleteSong() {
        var $deleteButton = $(this),
            songId = $deleteButton.attr('data-song-id');

        if (twitchBot.songRequest.getCurrentSongId() == songId) {
            twitchBot.youtube.skipSong();
        } else {    
            twitchBot.songRequest.deleteSong(songId, function() {
                $deleteButton.parents('tr').remove();
            });
        }           
    }

    $(function() {
        twitchBot.songRequest.init();
    });
})(jQuery);