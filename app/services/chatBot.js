var tmi = require('tmi.js');
var oauth = require('./oauth');
var songRequest = require('./songRequest');

var channel = 'vallelblanco';

var config = {
    options: {
        debug: true //TODO: turn this off
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: oauth.twitch.username,
        password: oauth.twitch.password
    },
    channels: [channel]
};

var client = null;

var bot = {
    socketApi: null,

    connect: function () {
        client = new tmi.client(config);
        client.connect();

        init();
    }
};

function init() {
    client.on("connected", function (address, port) {
        client.say(channel, 'Bienvenidos al canal.');
    });

    client.on("chat", function (channel, userstate, message, self) {
        // Don't listen to my own messages..
        if (self) return;

        var user = userstate['display-name'];

        if (message.indexOf('!songrequest') === 0 || message.indexOf('!sr') === 0) {
            var query = message.replace('!songrequest', '').trim();
            query = query.replace('!sr', '').trim();

            if (query) {
                songRequest.addSong(user, query, function(songTitle) {
                    client.say(channel, 'La canción ' + songTitle + ' ha sido agregada a la lista de reproducción por ' + user);
                });
            }
        }

        if (message.indexOf('!skip') === 0) {
            /*if (twitchbot.bot.skips.indexOf(user) == -1) {
                twitchbot.bot.skips.push(user);

                client.say(channel, user + ' ha votado por saltar la canción actual. Votos: ' + twitchbot.bot.skips.length + '/' + twitchbot.bot.countToSkip);

                if (twitchbot.bot.skips.length >= twitchbot.bot.countToSkip) {
                    twitchbot.bot.skips = [];
                    twitchbot.youtube.nextSong();
                }
            }*/
        }

        if (message.indexOf('!volume') === 0 && userstate.mod) {
            if (bot.socketApi) {
                var volume = message.replace('!volume', '').trim();
                bot.socketApi.sendMessage('!volume', volume);
            }
        }

        if (message.indexOf('!currentsong') === 0) {
            songRequest.getCurrentSong(function(currentSong) {
                if (currentSong) {
                    client.say(channel, "La canción actual es " + currentSong.title + " y fue agregada por " + currentSong.userName);
                }
            });
        }

        if (message.indexOf('!veto') === 0 && userstate.mod) {
            /*var currentSong = twitchbot.data.getCurrentSong();
            if (currentSong) {
                twitchbot.data.addVeto(song);
                client.say(channel, "La canción " + currentSong.video.title + " ha sido vetada por " + currentSong.user);
            }*/
        }

    });

    client.on("hosted", function (channel, username, viewers, autohost) {
        client.say(channel, "Gracias " + username + " por darnos host. Todos denle follow a " +
            username + " (" + channel + ").");
    });
}

module.exports = bot;