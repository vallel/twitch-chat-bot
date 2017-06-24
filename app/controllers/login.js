var twitchApi = require('../services/twitchApi');

exports.login = function(req, res, next) {
    var code = req.query.code;

    twitchApi.oauthLogin(code, function() {
        res.redirect('/');
    }, function(data) {
        var oauthKey = data.access_token;
        req.session.oauth = oauthKey;
        req.session.refreshToken = data.refresh_token;

        twitchApi.getUserData(oauthKey, function(data) {
            req.session.twitchId = data._id;
            req.session.name = data.name;
            req.session.displayName = data.displayName;
            req.session.logo = data.logo;
            req.session.email = data.email;

            res.redirect('/puntos');
        })
    });
};