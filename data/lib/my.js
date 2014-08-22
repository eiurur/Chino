(function() {
  var crypto, moment, my, util;

  util = require('util');

  moment = require('moment');

  crypto = require('crypto');

  my = function() {
    return {
      c: function(desciption, str) {
        desciption = desciption || '';
        str = str || '';
        return console.log("" + desciption + ": " + str);
      },
      e: function(desciption, str) {
        desciption = desciption || '';
        str = str || '';
        return console.error("" + desciption + ": " + str);
      },
      dump: function(obj) {
        return console.log(util.inspect(obj, false, null));
      },
      include: function(array, str) {
        return !array.every(function(elem, idx, array) {
          return str.indexOf(elem) === -1;
        });
      },
      createParams: function(params) {
        var k, v;
        return ((function() {
          var _results;
          _results = [];
          for (k in params) {
            v = params[k];
            _results.push("" + k + "=" + v);
          }
          return _results;
        })()).join('&');
      },
      formatX: function(time) {
        if (time != null) {
          return moment(time).format("X");
        } else {
          return moment().format("X");
        }
      },
      formatYMD: function(time) {
        if (time != null) {
          return moment(new Date(time)).format("YYYY-MM-DD");
        } else {
          return moment().format("YYYY-MM-DD");
        }
      },
      formatYMDHms: function(time) {
        if (time != null) {
          return moment(new Date(time)).format("YYYY-MM-DD HH:mm:ss");
        } else {
          return moment().format("YYYY-MM-DD HH:mm:ss");
        }
      },
      addHoursFormatYMD: function(hours, time) {
        if (time != null) {
          return moment(new Date(time)).add('h', hours).format("YYYY-MM-DD");
        } else {
          return moment().add('h', hours).format("YYYY-MM-DD");
        }
      },
      addHoursFormatYMDHms: function(hours, time) {
        if (time != null) {
          return moment(new Date(time)).add('h', hours).format("YYYY-MM-DD HH:mm:ss");
        } else {
          return moment().add('h', hours).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      isSameDay: function(startTimeYMD, endTimeYMD) {
        if (startTimeYMD === endTimeYMD) {
          return true;
        } else {
          return false;
        }
      },
      createHash: function(key, algorithm) {
        algorithm = algorithm || "sha256";
        return crypto.createHash(algorithm).update(key).digest("hex");
      }
    };
  };

  exports.my = my();

}).call(this);
