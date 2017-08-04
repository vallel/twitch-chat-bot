var command = require('../services/command');

exports.index = function(req, res, next) {
    command.getList(req.session.name, false, function (commands) {
        res.render('commands', {
            'commands': commands
        });
    });
};

exports.create = function(req, res, next) {
    var channel = req.session.name,
        commandName = req.body.commandName,
        message = req.body.commandMessage,
        enabled = req.body.commandEnabled;

    if (commandName && message && enabled) {
        command.save(channel, commandName, message, enabled, false, function() {
            res.redirect('/comandos');
        });
    }
};

exports.saveGamble = function(req, res, next) {
    var channel = req.session.name,
        commandName = req.body.command,
        enabled = req.body.enabled || false,
        cooldown = parseInt(req.body.cooldown);

    if (commandName) {
        command.save(channel, commandName, '', enabled, true, function () {
            command.saveConfig(channel, commandName, 'cooldown', req.body.cooldown, function() {
                res.redirect('/puntos');
            });
        });
    } else {
        res.redirect('/puntos');
    }
};