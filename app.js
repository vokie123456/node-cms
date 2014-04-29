var config = require('./config'),
    express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
   
    compress = require('compression')(),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    logger = require('morgan'),
    bodyParser = require('body-parser');
  
var index = require('./routes/index');
var admin = require('./routes/admin');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(compress);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser("abc"));
app.use(session({ secret: config.secret, key: 'sid'}));



app.use(express.static(path.join(__dirname, 'public/')));

app.use('/', index);
app.use('/admin',admin);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next();
});

/// error handlers

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
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
