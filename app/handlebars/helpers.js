var moment = require('moment');

var register = function(hbs) {
    var helpers = {
        add: function (a, b) {
            return a + b;
        },

        formatDate: function(date, format) {
            return moment(date).format(format);
        }
    };

    if (hbs && typeof hbs.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            hbs.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
};

module.exports = register;