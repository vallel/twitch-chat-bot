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
    }

    $(function() {
       twitchBot.socketApi.init();
    });
})(jQuery, io);