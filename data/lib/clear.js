(function() {
  var ClientProvider, moment, my, s, _;

  _ = require('lodash');

  moment = require('moment');

  my = require('./my').my;

  ClientProvider = require('./model').ClientProvider;

  s = process.env.NODE_ENV === "production" ? require("./production") : require("./development");

  exports.clearActives = function() {
    return (function() {
      return setInterval((function() {
        return ClientProvider.clearActives(function(err, data) {
          if (err) {
            my.dump(err);
          }
          return my.c("delete num = " + data.affectedRows);
        });
      }), s.INTERVAL_TIME_CLEAR);
    })();
  };

}).call(this);
