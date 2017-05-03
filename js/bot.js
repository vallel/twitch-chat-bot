var twitchbot = twitchbot || {};

(function() {
    twitchbot.bot = {
        client: {},

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

            if (message.indexOf('!songrequest') === 0) {
                var query = message.replace('!songrequest', '').trim();
                if (query) {
                    var songUrl = 'https://www.youtube.com/embed?listType=search&list=' + query,
                        user = userstate['display-name'];

                    twitchbot.data.addSongRequest(user, songUrl);

                    client.say(channel, 'La canción ' + query + ' ha sido agregada a la lista de reproducción por ' + user);
                }
            }
            if (message.indexOf('!time') === 0) {
                client.say(channel, 'Llevamos ' + time + ' en linea');
            }

        });

        client.on("hosted", function (channel, username, viewers, autohost) {
            client.say(channel, "Gracias " + username + " por darnos host. Todos denle follow a " +
                username + " (" + channel + ").");
        });
    }
})();