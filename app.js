var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var redis = require('redis');
var session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();
var logger = require('morgan');
var models=require('./models');
// var uuid=require('uuid');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var g_routes=require('./groutes')
var app = express();
// port set to 8080
app.set('port', process.env.PORT || 8080);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'3947c69f-a554-416d-83ed-219f073dd175',
  resave:false,
  saveUninitialized:false,
  store:new RedisStore({ client: redisClient,prefix:'GiaComMediaServer:',ttl:3600 })
}));
app.use('/assets',express.static(path.join(__dirname, 'public')));
app.use('/vd1',express.static(path.join('/','opt','FireWall','LiveTV','static')))
// app.use(g_routes(app))
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
