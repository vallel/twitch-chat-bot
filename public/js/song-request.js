var twitchBot = twitchBot || {};

(function($) {
    twitchBot.songRequest = {
        deleteCurrentSong: function() {
            var songId = this.getCurrentSongId();

            $.ajax({
                url: '/songrequest/delete-song',
                data: {songId: songId},
                dataType: 'json',
                method: 'post'
            });
        },

        getCurrentSongId: function() {
            return $('.js-youtube-player').data('song-id');
        },

        updateCurrentSong: function() {

        }
    };
})(jQuery);