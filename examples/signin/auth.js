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

  app.get('/login', function(req, res){
    res.render('login', { user: req.user });
  });

  // POST /auth/persona
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  Persona authentication will verify the assertion obtained from
  //   the browser via the JavaScript API.
  app.post('/auth/persona',
    passport.authenticate('persona', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });



  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.  However, since this example does not
  //   have a database of user records, the Persona verified email address
  //   is serialized and deserialized.
  passport.serializeUser(function(user, cb) {
    User.findOrCreateByEmail(user.email, function(err, user) {
      if (err) return cb(err);
      cb(null, user.id);
    });
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, done);
  });


  // Use the PersonaStrategy within Passport.
  //   Strategies in passport require a `validate` function, which accept
  //   credentials (in this case, a Persona verified email address), and invoke
  //   a callback with a user object.
  passport.use(new PersonaStrategy({ audience: url },
    function(email, cb) {
      User.findOrCreateByEmail(email, function(err, user) {
        if (err) return cb(err);
        cb(null, user);
      });
    }
  ));

  cb();
};




