var command = require('../services/command');

exports.save = function(req, res, next) {
    var commandName = req.body.command,
        enabled = req.body.enabled || false;
    if (commandName) {
        command.save(commandName, enabled, function () {
            res.redirect('/puntos');
        });
    } else {
        res.redirect('/puntos');
    }
};