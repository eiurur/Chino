(function() {
  var ClientProvider, DB_HOST, DB_NAME, DB_PASSWORD, DB_URI, DB_USER, moment, mysql;

  mysql = require('mysql');

  moment = require('moment');

  DB_URI = process.env.CLEARDB_URI || '';

  DB_HOST = process.env.DB_HOST || 'localhost';

  DB_NAME = process.env.DB_NAME || 'cocoa';

  DB_USER = process.env.DB_USER || 'chino';

  DB_PASSWORD = process.env.DB_PASSWORD || 'rize';

  ClientProvider = (function() {
    function ClientProvider() {}

    ClientProvider.prototype.getConnection = function() {
      var client;
      console.log(DB_HOST, DB_NAME, DB_USER, DB_PASSWORD);
      return client = mysql.createConnection({
        host: DB_HOST,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
      });
    };

    ClientProvider.prototype.closeConnection = function(client) {
      return client.end();
    };

    ClientProvider.prototype.insertStoreTestData = function(callback) {
      var client, nowDate, store;
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      store = {
        id: 'test',
        email: 'test@gmail.com',
        password: 'test',
        UUID: 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013',
        name: 'テスト',
        categoryID: 1,
        url: 'http://example.com',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      client = this.getConnection();
      return client.query("INSERT INTO stores SET ?", store, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
        };
      })(this));
    };

    ClientProvider.prototype.insertCategoryTestData = function(callback) {
      var category, client, nowDate;
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      category = {
        id: 1,
        name: '飲食店'
      };
      client = this.getConnection();
      return client.query("INSERT INTO categories SET ?", category, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          return callback(err, data);
        };
      })(this));
    };

    ClientProvider.prototype.insertInfomationTestData = function(callback) {
      var client, infomation, nowDate;
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      infomation = {
        storeID: 'test',
        salesText: '(*´人｀*)',
        detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      client = this.getConnection();
      return client.query("INSERT INTO infomations SET ?", infomation, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
        };
      })(this));
    };

    ClientProvider.prototype.findStoreInfo = function(params, callback) {
      var UUID, client;
      client = this.getConnection();
      console.log('-------- findStoreInfo --------', params);
      UUID = params['UUID'] || 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013';
      return client.query('SELECT storeID, salesText, categories.name AS categoryName FROM stores LEFT JOIN infomations ON stores.id = infomations.storeID LEFT JOIN categories ON stores.categoryID = categories.id WHERE stores.UUID = ? ORDER BY infomations.id DESC LIMIT 1', UUID, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          return callback(err, data);
        };
      })(this));
    };

    ClientProvider.prototype.findStoreDetail = function(params, callback) {};

    return ClientProvider;

  })();

  exports.ClientProvider = new ClientProvider();

}).call(this);
