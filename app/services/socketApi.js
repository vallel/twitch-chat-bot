var chatBot = require('./chatBot');
chatBot.connect();

var socketApi = function (io) {
    io.on('connection', function(socket) {
        chatBot.socketApi = new Api(socket);

        socket.on('!getvolume', function(data) {
            chatBot.say(data.channel, "El volumen actual esta en " + data.volume + "%");
        });
    });
};

var Api = function (socket) {
    return {
        sendMessage: function (tag, data) {
            socket.emit(tag, data);
        }
    };
};

module.exports = socketApi;