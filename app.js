var express         = require('express');
var helmet          = require('helmet');
var csrf            = require('csurf');
var app             = express();
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var moment          = require('moment');
var path            = require('path');
var models          = require('./models');
var PORT            = process.env.PORT || 3000;
var passport        = require('passport');
var flash           = require('connect-flash'); // store and retrieve messages in session store
var session         = require('express-session'); // session middleware
var sessionStore    = require('connect-session-sequelize')(session.Store);
var favicon = require('serve-favicon');
var logger = require('morgan');

require('./api/auth/passport')(passport); // pass passport for configuration

// setup route middlewares
var csrfProtection  = csrf({ cookie: true });

//set secure Express/Connect apps with various HTTP headers
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(__dirname + "/public"));


// Configuring required for passport
app.use(session({
    name: 'oe_session',
    secret: 'zomaareenstukjetekstDatjenietzomaarbedenkt',
    maxAge: new Date(Date.now() + 3600000),
    store: new sessionStore({ db: models.sequelize, table: 'session' }),
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// ROUTES
require('./routes/index')(app, passport);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

models.sequelize.query('CREATE EXTENSION IF NOT EXISTS hstore').then(function () {
    models.sequelize.sync().then(function () {
        console.log('Database ready!');
    });
});


app.set('port', process.env.PORT || PORT);

var server = app.listen(app.get('port'), function () {
    console.log("NODE_ENV: "+process.env.NODE_ENV+' Billing Portal server listening on port ' + server.address().port);
});

module.exports = app;
