'use strict';
var User = {};
var Dirty = require('dirty');
var db;


var id = 0;
User.findOrCreateByEmail = function(email, cb/*(err, user)*/) {
  process.nextTick(function() {
    db.forEach(function(key, user) {
      if (key === 'email' && user.email === email) {
        cb(null, user);
      }
    });

    id++;
    var user = {id: id, email: email};
    db.set(id,  user, function() {
      cb(null, user);
    });
  });
};


User.findById = function(id, cb/*(err, user)*/) {
  process.nextTick(function() {
    var user = Dirty.get(id);
    cb(null, user);
  });
};


module.exports = {
  attach: function(settings, done) {
    db = Dirty(__dirname + '/../user.db');
    db.on('load', done);
  },

  User: User
};
