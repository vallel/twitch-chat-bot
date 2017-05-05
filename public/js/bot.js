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

            if (message.indexOf('!songrequest') === 0) {
                var query = message.replace('!songrequest', '').trim();
                if (query) {
                    twitchbot.youtube.search(query, function(video) {

                        twitchbot.data.addSongRequest(user, video);

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

            // if (message.indexOf('!time') === 0) {
            //     client.say(channel, 'Llevamos ' + time + ' en linea');
            // }

        });

        client.on("hosted", function (channel, username, viewers, autohost) {
            client.say(channel, "Gracias " + username + " por darnos host. Todos denle follow a " +
                username + " (" + channel + ").");
        });
    }
})();