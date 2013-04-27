'use strict';

var express = require('express');
var auth = require('./auth');
var async = require('async');
var app = express();
var db = require('./db');
var hbs = require('express-hbs');


/**
 * Intialize async DB
 */
function initDB(cb) {
  db.attach(null, cb);
}


/**
 * Initialize Express.
 */
function initExpress(cb) {
  app.use(express.static(__dirname + '/../../public'));

  app.engine('hbs', hbs.express3({partialsDir: __dirname + '/views/partials'}));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');

  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
  cb();
}


/**
 * Inititalize authorization.
 */
function initAuth(cb) {
  auth.attach({url: 'http://localhost:3000', app: app}, cb);
}


/**
 * Initialize routes.
 */
function initRoutes(cb) {
  // Simple route middleware to ensure user is authenticated.
  //   Use this route middleware on any resource that needs to be protected.  If
  //   the request is authenticated (typically via a persistent login session),
  //   the request will proceed.  Otherwise, the user will be redirected to the
  //   login page.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });

  app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  });

  cb();
}


async.series([initDB, initExpress, initAuth, initRoutes], function(err) {
  var port = 3000;
  if (err) {
    console.error(err);
    process.exit(1);
  }
  app.listen(port);
  console.log('Browse on http://localhost:'+port);
});

