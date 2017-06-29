var config = require('../config'),
    request = require('request');

var twitchApi = {
    oauthLogin: function(code, onError, onSuccess) {
        var url = 'https://api.twitch.tv/kraken/oauth2/token' +
            '?client_id=' + config.twitchApp.clientId +
            '&client_secret=' + config.twitchApp.secretKey +
            '&code=' + code +
            '&grant_type=authorization_code' +
            '&redirect_uri=' + config.twitchApp.redirectUrl;

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
                'Client-ID': config.twitchApp.clientId,
                'Authorization': 'OAuth ' + oauthKey
            },
            uri: 'https://api.twitch.tv/kraken/user'
        }, function(error, response, body) {
            if (!error && response.statusCode === 200 && onSuccess) {
                onSuccess(JSON.parse(body));
            }
        });
    }
};

module.exports = twitchApi;