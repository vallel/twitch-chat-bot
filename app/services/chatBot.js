var tmi = require('tmi.js');
var appConfig = require('../config');
var songRequest = require('./songRequest');
var rank = require('./rank');

var channel = appConfig.twitchChannel;

var config = {
    options: {
        debug: true //TODO: turn this off
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: appConfig.botOauth.username,
        password: appConfig.botOauth.oAuthKey
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
    rank.init();

    client.on("connected", function (address, port) {
        // client.say(channel, 'Bienvenidos al canal.');
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

            songRequest.getCurrentSong(function(currentSong) {
                if (currentSong) {
                    var skips = currentSong.skips || [];

                    if (skips.indexOf(user) === -1) {
                        skips.push(user);

                        if (skips.length < songRequest.skipLimit) {
                            songRequest.updateSong(currentSong, {skips: skips});
                        } else {
                            songRequest.deleteSong(currentSong._id, function() {
                                bot.socketApi.sendMessage('!skip', true);
                            });
                        }

                        client.say(channel, user + ' ha votado por saltar la canción actual. Votos: ' + skips.length + '/' + songRequest.skipLimit);
                    }
                }
            });
        }

        if (message.indexOf('!volume') === 0 && (userstate.mod || userstate.badges.broadcaster)) {
            if (bot.socketApi) {
                var volume = message.replace('!volume', '').trim();
                if (volume.length && volume >= 0 && volume <= 100) {
                    bot.socketApi.sendMessage('!volume', volume);
                    client.say(channel, user + " ha cambiado el volumen de la música a " + volume);
                }
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

        if (message.indexOf('!points') === 0) {
            rank.getPoints(user, function(data) {
                var points = 0;
                if (data && data.points) {
                    points = data.points;
                }
                client.say(channel, user + ' tiene ' + points + ' puntos.');
            });
        }

    });

    client.on("hosted", function (channel, username, viewers, autohost) {
        client.say(channel, "Gracias " + username + " por darnos host. Todos denle follow a " +
            username + " (" + channel + ").");
    });
}

module.exports = bot;