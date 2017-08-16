var bot = require('../services/chatBot');

exports.joinChannel = function(req, res, next) {
    bot.join(req.session.name, req.session.oauth);
    res.redirect(req.headers.referer);
};

exports.leaveChannel = function(req, res, next) {
    bot.part(req.session.name);
    res.redirect(req.headers.referer);
}