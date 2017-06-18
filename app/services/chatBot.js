var tmi = require('tmi.js');
var appConfig = require('../config');
var songRequest = require('./songRequest');
var rank = require('./rank');
var gamble = require('./gamble');
var command = require('./command');

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

        if (message.indexOf('!volume') === 0 && (userstate.mod || (userstate.badges && userstate.badges.broadcaster))) {
            if (bot.socketApi) {
                var volume = message.replace('!volume', '').trim();
                if (volume.length && volume >= 0 && volume <= 100) {
                    bot.socketApi.sendMessage('!volume', volume);
                    client.say(channel, user + " ha cambiado el volumen de la música a " + volume);
                }
            }
        }

        if (message.indexOf('!stop') === 0 && (userstate.mod || (userstate.badges && userstate.badges.broadcaster))) {
            if (bot.socketApi) {
                bot.socketApi.sendMessage('!stop', true);
                client.say(channel, user + " ha detenido la canción actual." );
            }
        }

        if (message.indexOf('!play') === 0 && (userstate.mod || (userstate.badges && userstate.badges.broadcaster))) {
            if (bot.socketApi) {
                bot.socketApi.sendMessage('!play', true);
            }
        }

        if (message.indexOf('!pause') === 0 && (userstate.mod || (userstate.badges && userstate.badges.broadcaster))) {
            if (bot.socketApi) {
                bot.socketApi.sendMessage('!pause', true);
                client.say(channel, user + " ha pausado la canción actual." );
            }
        }

        if (message.indexOf('!currentsong') === 0) {
            songRequest.getCurrentSong(function(currentSong) {
                if (currentSong) {
                    client.say(channel, "La canción actual es " + currentSong.title + " y fue agregada por " + currentSong.userName);
                }
            });
        }

        if (message.indexOf('!points') === 0) {
            rank.getPoints(user, function(points) {
                client.say(channel, user + ' tiene ' + points + ' puntos.');
            });
        }

        if (message.indexOf('!gamble') === 0) {
            var points = message.replace('!gamble', '').trim();
            command.get('gamble', function (data) {
                if (data.enabled) {
                    if (parseInt(points) > 0) {
                        gamble.run(user, points, function(result, win, points, currentPoints) {
                            if (result === -1) {
                                client.say(channel, user + ' no tiene los puntos suficientes para apostar.');
                            } else {
                                var outcome = win ? ' ganó ' : ' perdió ',
                                    msg = 'Cayó ' + result + '. ' + user + outcome + points + ' y ahora tiene ' + currentPoints + ' puntos.';
                                client.say(channel, msg);
                            }
                        });
                    }
                }
            });
        }

    });

    client.on("hosted", function (channel, username, viewers, autohost) {
        client.say(channel, "Gracias " + username + " por darnos host. Todos denle follow a " +
            username + " (" + channel + ").");
    });
}

module.exports = bot;