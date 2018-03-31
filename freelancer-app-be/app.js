var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
// var session = require('client-sessions');
var expressSessions = require("express-session");
var localStrategy = require("passport-local").Strategy;
var mongoStore = require("connect-mongo")(expressSessions);
var passport = require('passport');
var loginRtn = require('./routes/registration/login');

var index = require('./routes/index');
var app = express();
var mongoSessionURL = 'mongodb://admin:admin@ds121189.mlab.com:21189/freelancerdb';
// all environments
//configure the sessions with our application
app.use(expressSessions({
    secret: 'cmpe273_freelancer_012541984',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(logger('dev'));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.set('port', process.env.PORT || 3001);

passport.use('local', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    loginRtn.checkUserExist(email, password).
        then(function (results) {
            return loginRtn.checkPassword(password, results);
        }).then(function (results) {
            done(null, results);
        }).catch(function (err) {
            done(null, false,err);
        });
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(require('./routes/users/user_routes'));
app.use(require('./routes/registration/registration_routes'));
app.use(require('./routes/projects/project_routes'));
app.use(require('./routes/skills/skills_routes'));
app.use(require('./routes/bids/bid_routes'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;