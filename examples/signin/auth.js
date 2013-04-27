'use strict';
var passport = require('passport');
var User = require('./db').User;
var PersonaStrategy = require('../..').Strategy;


exports.attach = function attach(settings, cb) {
  var app = settings.app;
  var url = settings.url;

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());


  // login occurs on client side
  // app.get('/auth/login', function(req, res) {
  //   res.render('login', {
  //     user: req.user
  //   });
  // });

  app.post('/auth/logout', function(req, res) {
    req.logout();
    res.send('ok');
  });

  // POST /auth/persona
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  Persona authentication will verify the assertion obtained from
  //   the browser via the JavaScript API.
  app.post('/auth/persona', passport.authenticate('persona',
    { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  });

  // Passports calls this to store user into session
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      // This should only be the id, but it can be anything. The callback
      // data is used by deserializeUser
      cb(null, user.id);
    });
  });

  // Passport calls this to populate req.user
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    // In real use, this would be memory store like Redis
    User.findById(id, done);
  });


  // Use the PersonaStrategy within Passport.
  //   Strategies in passport require a `validate` function, which accept
  //   credentials (in this case, a Persona verified email address), and invoke
  //   a callback with a user object.
  passport.use(new PersonaStrategy({ audience: url }, function(email, cb) {
    console.log('passportuse', email);
    User.findOrCreateByEmail(email, function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  }));

  cb();
};
