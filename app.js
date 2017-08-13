var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var hbs = require('hbs');
var hbsHelpers = require('./app/handlebars/helpers')(hbs);
var bot = require('./app/services/chatBot');

var index = require('./routes/index');
var ranking = require('./routes/ranking');
var commands = require('./routes/commands');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: '8as23df7897s78f97sdf897sdf',
    resave: false,
    saveUninitialized: true
    // ,cookie: { secure: true }
}));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/swal', express.static(path.join(__dirname, 'node_modules/sweetalert/dist')));

app.use(function(req, res, next) {
    if (req.session.twitchId || req.path === '/' || req.path === '/login' || req.path === '/stay-tuned') {
        res.locals.isBotConnected = bot.isConnected(req.session.name);
        res.locals.appName = process.env.APP_NAME;
        next();
    } else {
        res.redirect('/');
    }
});

app.use('/', index);
app.use('/puntos', ranking);
app.use('/comandos', commands);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
