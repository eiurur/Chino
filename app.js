(function() {
  var async, clearActives, cronJob, dir, moment, my, s, serve, tasks4startUp, _;

  _ = require('lodash');

  moment = require('moment');

  cronJob = require('cron').CronJob;

  async = require('async');

  dir = './data/lib/';

  my = require(dir + 'my').my;

  clearActives = require(dir + 'clear').clearActives;

  serve = require('./site/app').serve;

  s = process.env.NODE_ENV === "production" ? require("./data/lib/production") : require("./data/lib/development");

  tasks4startUp = [
    function(callback) {
      my.c("■ Server task start");
      serve(null, "Create Server");
      setTimeout((function() {
        return callback(null, "Create! Server\n");
      }), s.GRACE_TIME_SERVER);
    }, function(callback) {
      my.c("■ Actives Clear Task start");
      clearActives(null, "Clear ");
      setTimeout((function() {
        return callback(null, "Actives Data CLEAR \n");
      }), s.GRACE_TIME_CLEAR);
    }
  ];

  async.series(tasks4startUp, function(err, results) {
    if (err) {
      console.error(err);
    } else {
      console.log("\nall done... Start!!!!\n");
    }
  });

}).call(this);
