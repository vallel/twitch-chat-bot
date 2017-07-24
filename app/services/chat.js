var fs = require('fs');
var path = require('path');

var chat = {

    addConnectedUser: function(channel, user, callback) {
        var data = chat.getConnectedUsers(channel);
        if (data.indexOf(user) === -1) {
            data.push(user);
            updateConnectedUsers(channel, data, callback);
        }
    },

    removeConnectedUser: function(channel, user, callback) {
        var data = chat.getConnectedUsers(channel);
        var index = data.indexOf(user);
        if (index !== -1) {
            data.splice(index, 1);
            updateConnectedUsers(channel, data, callback);
        }
    },

    getConnectedUsers: function (channel, callback) {
        var connectedUsers = [],
            file = getConnectedUsersFileName(channel);
            
        if (fs.existsSync(file)) {
            var fileContent = fs.readFileSync(file, 'utf8');

            if (fileContent) {
                connectedUsers = JSON.parse(fileContent);
            }
        }

        return connectedUsers;
    }
};

function getConnectedUsersFileName(channel) {
    return path.join(__dirname, '../../uploads/' + channel + '.json');
}

function updateConnectedUsers(channel, data, fn) {
    var filename = getConnectedUsersFileName(channel);
    fs.writeFileSync(filename, JSON.stringify(data));

    if (fn) {
        fn();
    }
}

module.exports = chat;