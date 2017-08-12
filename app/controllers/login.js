var twitchApi = require('../services/twitchApi'),
    channelDao = require('../data/channel');

exports.login = function(req, res, next) {
    var code = req.query.code;

    twitchApi.oauthLogin(code, function() {
        res.redirect('/');
    }, function(data) {
        var oauthKey = data.access_token;
        req.session.oauth = oauthKey;
        req.session.refreshToken = data.refresh_token;

        twitchApi.getUserData(oauthKey, function(userData) {
            channelDao.get(userData.name, function(channelData) {
                if (channelData && channelData.active) {
                    req.session.twitchId = userData._id;
                    req.session.name = userData.name;
                    req.session.displayName = userData.displayName;
                    req.session.logo = userData.logo;
                    req.session.email = userData.email;

                    res.redirect('/puntos');
                } else {
                    if (channelData) {
                        res.redirect('/stay-tuned');
                    } else {
                        channelDao.add(userData.name, userData.email, 0, function() {
                            res.redirect('/stay-tuned');
                        });
                    }
                }
            });
        })
    });
};

exports.stayTuned = function(req, res, next) {
    res.render('staytuned.hbs', {
        notLogged: true
    });
};