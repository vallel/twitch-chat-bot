var command = require('../services/command');

exports.index = function(req, res, next) {
    command.getList(req.session.name, false, function (commands) {
        var msg = req.session.msg;
        req.session.msg = null;
        
        res.render('commands', {
            'commands': commands,
            msg: msg
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

exports.delete = function(req, res, next) {
    var commandName = req.params.commandName,
        channel = req.session.name;
    
    command.delete(channel, commandName, function() {
        req.session.msg = 'El comando <strong>!'+ commandName +'</strong> ha sido borrado.';
        res.redirect('/comandos');
    });
};