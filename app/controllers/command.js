var command = require('../services/command');

exports.saveGamble = function(req, res, next) {
    var commandName = req.body.command,
        enabled = req.body.enabled || false,
        cooldown = parseInt(req.body.cooldown);

    if (commandName) {
        command.save(commandName, enabled, function () {
            command.saveConfig(commandName, 'cooldown', req.body.cooldown, function() {
                res.redirect('/puntos');
            });
        });
    } else {
        res.redirect('/puntos');
    }
};