var twitchBot = twitchBot || {};

(function($, io) {
    twitchBot.socketApi = {
        init: function() {
            var socket = io.connect('http://localhost:3000/');
            wireEvents(socket);
        }
    };

    function wireEvents(socket) {
        socket.on('!volume', twitchBot.youtube.setVolume);
        socket.on('!skip', twitchBot.youtube.skipSong);
        socket.on('!play', twitchBot.youtube.play);
        socket.on('!stop', twitchBot.youtube.stop);
        socket.on('!pause', twitchBot.youtube.pause);
        socket.on('!songrequest', twitchBot.youtube.update);
    }

    $(function() {
       twitchBot.socketApi.init();
    });
})(jQuery, io);