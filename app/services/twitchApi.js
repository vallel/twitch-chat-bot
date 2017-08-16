var request = require('request');

var twitchApi = {
    oauthLogin: function(code, onError, onSuccess) {
        var url = 'https://api.twitch.tv/kraken/oauth2/token' +
            '?client_id=' + process.env.APP_CLIENT_ID +
            '&client_secret=' + process.env.APP_SECRET_KEY +
            '&code=' + code +
            '&grant_type=authorization_code' +
            '&redirect_uri=' + process.env.APP_AUTH_REDIRECT_URL;

        request.post(url, function (error, response, body) {
            if (!error && response.statusCode === 200 && onSuccess) {
                onSuccess(JSON.parse(body));
            } else if (onError) {
                onError();
            }
        });
    },

    getUserData: function(oauthKey, onSuccess) {
        request({
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': process.env.APP_CLIENT_ID,
                'Authorization': 'OAuth ' + oauthKey
            },
            uri: 'https://api.twitch.tv/kraken/user'
        }, function(error, response, body) {
            if (!error && response.statusCode === 200 && onSuccess) {
                onSuccess(JSON.parse(body));
            }
        });
    },

    getStreamData: function(oauthKey, onSuccess) {
        twitchApi.getChannelData(oauthKey, function(channelData) {
            request({
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': process.env.APP_CLIENT_ID
                },
                uri: 'https://api.twitch.tv/kraken/streams/' + channelData._id
            }, function(error, response, body) {
                if (!error && response.statusCode === 200 && onSuccess) {
                    onSuccess(JSON.parse(body));
                }
            });
        });
    },

    getChannelData: function(oauthKey, onSuccess) {
        request({
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': process.env.APP_CLIENT_ID,
                'Authorization': 'OAuth ' + oauthKey
            },
            uri: 'https://api.twitch.tv/kraken/channel'
        }, function(error, response, body) {
            if (!error && response.statusCode === 200 && onSuccess) {
                onSuccess(JSON.parse(body));
            }
        });
    }
};

module.exports = twitchApi;