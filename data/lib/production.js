(function() {
  exports.DB_HOST = process.env.DB_HOST;

  exports.DB_NAME = process.env.DB_NAME;

  exports.DB_USER = process.env.DB_USER;

  exports.DB_PASSWORD = process.env.DB_PASSWORD;

  exports.GRACE_TIME_SERVER = 1 * 1000;

  exports.GRACE_TIME_CLEAR = 1 * 1000;

  exports.INTERVAL_TIME_CLEAR = 10 * 1000;

}).call(this);
