var twitchbot = twitchbot || {};

(function() {
    twitchbot.bot = {
        client: {},

        countToSkip: 3,

        skips: [],

        config: {
            options: {
                debug: true
            },
            connection: {
                reconnect: true,
            },
            identity: {
                username: twitchbot.oauth.username,
                password: twitchbot.oauth.password
            },
            channels: ['#vallelblanco']
        },

        init: function () {
            this.client = new tmi.client(this.config);

            this.client.connect();

            wireEvents();
        }
    }

    function wireEvents() {
        var client = twitchbot.bot.client,
            channel = twitchbot.bot.config.channels[0];

        client.on("connected", function (address, port) {
            client.say(channel, 'Bienvenidos al canal.');
        });

        client.on("chat", function (channel, userstate, message, self) {
            // Don't listen to my own messages..
            if (self) return;

            var user = userstate['display-name'];

            if (message.indexOf('!songrequest') === 0 || message.indexOf('!sr') === 0) {
                var query = message.replace('!songrequest', '').trim();
                query = message.replace('!sr', '').trim();
                
                if (query) {
                    twitchbot.youtube.search(query, function(video) {

                        var songs = twitchbot.data.getSongRequests();
                        twitchbot.data.addSongRequest(user, video);
                        if (!songs) {
                            twitchbot.youtube.nextSong();
                        }

                        client.say(channel, 'La canción ' + video.title + ' ha sido agregada a la lista de reproducción por ' + user);
                    });
                }
            }

            if (message.indexOf('!skip') === 0) {
                if (twitchbot.bot.skips.indexOf(user) == -1) {
                    twitchbot.bot.skips.push(user);
                    
                    client.say(channel, user + ' ha votado por saltar la canción actual. Votos: ' + twitchbot.bot.skips.length + '/' + twitchbot.bot.countToSkip);

                    if (twitchbot.bot.skips.length >= twitchbot.bot.countToSkip) {
                        twitchbot.bot.skips = [];
                        twitchbot.youtube.nextSong();
                    }
                }
            }

            if (message.indexOf('!currentsong') === 0) {
                var currentSong = twitchbot.data.getCurrentSong();
                if (currentSong) {
                    client.say(channel, "La canción actual es " + currentSong.video.title + " y fue agregada por " + currentSong.user);
                }
            }

            // if (message.indexOf('!veto') === 0 && userstate.mod) {
            //     var currentSong = twitchbot.data.getCurrentSong();
            //     if (currentSong) {
            //         twitchbot.data.addVeto(song);
            //         client.say(channel, "La canción " + currentSong.video.title + " ha sido vetada por " + currentSong.user);
            //     }
            // }

        });

        client.on("hosted", function (channel, username, viewers, autohost) {
            client.say(channel, "Gracias " + username + " por darnos host. Todos denle follow a " +
                username + " (" + channel + ").");
        });
    }
})();