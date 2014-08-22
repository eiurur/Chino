(function() {
  var ClientProvider, DB_HOST, DB_NAME, DB_PASSWORD, DB_URI, DB_USER, moment, my, mysql;

  mysql = require('mysql');

  moment = require('moment');

  my = require('./my').my;

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
        UUID: my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013'),
        name: 'テスト',
        categoryID: 1,
        url: 'http://example.com',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      client = this.getConnection();
      return client.query('INSERT INTO stores SET ?', store, (function(_this) {
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
      return client.query('INSERT INTO categories SET ?', category, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          return callback(err, data);
        };
      })(this));
    };

    ClientProvider.prototype.insertInfomationTestData = function(callback) {
      var client, infomation, nowDate;
      console.log(my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013'));
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      infomation = {
        UUID: my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013'),
        salesText: '(*´人｀*)',
        detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      client = this.getConnection();
      return client.query('INSERT INTO infomations SET ?', infomation, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
        };
      })(this));
    };

    ClientProvider.prototype.findStoreInfo = function(params, callback) {
      var UUID, client;
      console.log('-------- findStoreInfo --------', params);
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      client = this.getConnection();
      return client.query('SELECT stores.name AS storeName, salesText, categories.name AS categoryName FROM stores LEFT JOIN infomations ON stores.id = infomations.storeID LEFT JOIN categories ON stores.categoryID = categories.id WHERE stores.UUID = ? ORDER BY infomations.id DESC LIMIT 1', UUID, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          return callback(err, data);
        };
      })(this));
    };

    ClientProvider.prototype.findStoreDetail = function(params, callback) {};

    ClientProvider.prototype.findActiveCustomer = function(params, callback) {
      var UUID, client;
      console.log('-------- findActiveCustomer --------', params);
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      client = this.getConnection();
      return client.query('SELECT stores.name AS storeName, salesText, categories.name AS categoryName FROM stores LEFT JOIN infomations ON stores.id = infomations.storeID LEFT JOIN categories ON stores.categoryID = categories.id WHERE stores.UUID = ? ORDER BY infomations.id DESC LIMIT 1', UUID, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          return callback(err, data);
        };
      })(this));
    };

    ClientProvider.prototype.isValidRequest = function(params, callback) {
      var UUIDHashed, client;
      console.log('-------- isValidRequest --------', params);
      UUIDHashed = params['UUIDHashed'];
      client = this.getConnection();
      return client.query('SELECT count(*) FROM stores WHERE UUIDHashed = ?', UUIDHashed, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          return callback(err, data);
        };
      })(this));
    };

    ClientProvider.prototype.notifyActiveCustomer = function(params, callback) {
      var UUID, active, client, deviceIDHashed, nowDate;
      console.log('-------- notifyActiveCustomer --------', params);
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      deviceIDHashed = params['deviceIDHashed'];
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      active = {
        UUID: UUID,
        deviceIDHashed: deviceIDHashed,
        createdAt: nowDate,
        updatedAt: nowDate
      };
      client = this.getConnection();
      return client.query("INSERT INTO actives SET ? ON DUPLICATE KEY updatedAt = " + nowDate, active, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          return;
          return callback(err, data);
        };
      })(this));
    };

    return ClientProvider;

  })();

  exports.ClientProvider = new ClientProvider();

}).call(this);
