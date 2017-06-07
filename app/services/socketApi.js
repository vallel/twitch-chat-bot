var chatBot = require('./chatBot');
chatBot.connect();

var socketApi = function (io) {
    io.on('connection', function(socket) {
        chatBot.socketApi = new Api(socket);
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