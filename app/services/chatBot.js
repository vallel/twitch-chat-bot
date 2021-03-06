var tmi = require('tmi.js'),
    songRequest = require('./songRequest'),
    rank = require('./rank'),
    gamble = require('./gamble'),
    command = require('./command'),
    chat = require('./chat'),
    twitchApi = require('./twitchApi'),
    moment = require('moment');

var config = {
    options: {
        debug: true //TODO: turn this off
    },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.BOT_OAUTH_KEY
    },
    channels: []
};

var client = null;

var bot = {
    socketApi: null,
    
    connectedTo: [],

    oauthKeys: {},

    connect: function () {
        client = new tmi.client(config);
        client.connect();

        init();
    },

    join: function(channel, oauthKey) {
        if (!bot.isConnected(channel)) {
            client.join(channel);
            rank.init(channel);
            bot.connectedTo.push(channel);
            bot.oauthKeys[channel] = oauthKey; 
        }
    },

    part: function(channel) {
        if (bot.isConnected(channel)) {
            client.part(channel);
            bot.oauthKeys[channel] = null;
            bot.connectedTo.splice(bot.connectedTo.indexOf(channel), 1);
        }
    },

    isConnected: function(channel) {
        var index = bot.connectedTo.indexOf(channel);
        return index !== -1;
    },

    say: function(channel, msg) {
        client.say(channel, msg);
    }
};

function init() {

    client.on("connected", function (address, port) {
        // client.say(channel, 'Bienvenidos al canal.');
    });

    client.on("chat", function (channel, userstate, message, self) {
        // Don't listen to my own messages..
        if (self) return;

        var user = userstate['username'].toLowerCase();
        channel = channel.replace('#', '');

        if (message.indexOf('!uptime') === 0) {
            twitchApi.getStreamData(bot.oauthKeys[channel], function(streamData) {
                if (streamData && streamData.stream) {
                    var nowUtc = moment.utc().format(),
                        streamStarted = moment.utc(streamData.stream.created_at).format(),
                        elapsed = moment.duration(moment(nowUtc).diff(streamStarted)),
                        elapsedTime = elapsed._data.hours > 0 ? elapsed._data.hours +' hora(s) y ' : '';
                        elapsedTime += elapsed._data.minutes +' minutos';

                    client.say(channel, 'El stream lleva ' + elapsedTime + ' en linea.');
                }
            });
        }

        if (message.indexOf('!songrequest') === 0 || message.indexOf('!sr') === 0) {
            var query = message.replace('!songrequest', '').trim();
            query = query.replace('!sr', '').trim();

            if (query) {
                songRequest.addSong(channel, user, query, function(songTitle) {
                    bot.socketApi.sendMessage('!songrequest', true);
                    client.say(channel, 'La canción ' + songTitle + ' ha sido agregada a la lista de reproducción por ' + user);
                });
            }
        }

        if (message.indexOf('!skip') === 0) {

            songRequest.getCurrentSong(channel, function(currentSong) {
                if (currentSong) {
                    var skips = [];
                    if (currentSong.skips) {
                        skips = JSON.parse(currentSong.skips);
                    }

                    if (skips.indexOf(user) === -1) {
                        skips.push(user);

                        if (skips.length < songRequest.skipLimit) {
                            songRequest.updateSong(currentSong, skips);
                        } else {
                            songRequest.deleteSong(currentSong.id, function() {
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
                    client.say(channel, user + " ha cambiado el volumen de la música a " + volume + "%");
                } else {
                    bot.socketApi.sendMessage('!getvolume', channel);
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
            songRequest.getCurrentSong(channel, function(currentSong) {
                if (currentSong) {
                    client.say(channel, "La canción actual es " + currentSong.title + " y fue agregada por " + currentSong.userName);
                }
            });
        }

        if (message.indexOf('!points') === 0) {
            rank.getPoints(channel, user, function(points) {
                client.say(channel, user + ' tiene ' + points + ' puntos.');
            });
        }

        if (message.indexOf('!gamble') === 0) {
            var points = message.replace('!gamble', '').trim();
            command.get(channel, 'gamble', function (data) {
                if (data && data.enabled) {
                    if (parseInt(points) > 0) {
                        gamble.run(channel, user, points, function(result, win, points, currentPoints, nextGamble) {
                            if (nextGamble) {
                                client.say(channel, user + ' no puedes apostar en este momento, debes esperar al menos '+ nextGamble +' minutos.');
                            } else if (result === -1) {
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

        command.getList(channel, false, function(data) {
            for (var i = 0; i < data.length; i++) {
                if (message.indexOf('!' + data[i].name) === 0 && data[i].enabled) {
                    client.say(channel, data[i].message);
                }
            }
        });

    });

    client.on("join", function (channel, username, self) {
        channel = channel.replace('#', '');
        chat.addConnectedUser(channel, username);
    });

    client.on("part", function (channel, username, self) {
        channel = channel.replace('#', '');
        chat.removeConnectedUser(channel, username);
    });

    client.on("hosted", function (channel, username, viewers, autohost) {
        client.say(channel, "Gracias " + username + " por darnos host. Todos denle follow a " +
            username + " (" + channel + ").");
    });
}

module.exports = bot;