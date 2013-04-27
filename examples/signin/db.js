'use strict';
var User = {};
var db = [];

// Just a mock database using array

User.findOrCreateByEmail = function(email, cb/*(err, user)*/) {
  process.nextTick(function() {
    var i, il, item;
    for (i = 0, il = db.length; i < il; i++) {
      item = db[i];
      if (item.email === email) {
        return cb(null, item);
      }
    }

    cb(null, db.push({id: db.length, email: email}));
  });
};


User.findById = function(id, cb/*(err, user)*/) {
  process.nextTick(function() {
    cb(null, db[id]);
  });
};


module.exports = {
  attach: function(settings, done) {
    done();
  },

  User: User
};
