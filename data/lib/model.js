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

    ClientProvider.prototype.executeSQL = function(sql, param, callback) {
      var client;
      client = this.getConnection();
      return client.query(sql, param, (function(_this) {
        return function(err, data) {
          _this.closeConnection(client);
          if (callback != null) {
            callback(err, data);
          }
        };
      })(this));
    };

    ClientProvider.prototype.insertStoreTestData = function(callback) {
      var nowDate, sql, store;
      sql = 'INSERT INTO stores SET ?';
      nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
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
      return this.executeSQL(sql, store, callback);
    };

    ClientProvider.prototype.insertCategoryTestData = function(callback) {
      var categories, sql;
      sql = 'INSERT INTO categories (id, name) VALUES ?';
      categories = [[1, 'ファッション'], [2, 'グッズ'], [3, 'フード'], [4, '食料品'], [5, '雑貨'], [6, '家具・インテリア'], [7, 'サービス'], [8, 'その他']];
      return this.executeSQL(sql, [categories], callback);
    };

    ClientProvider.prototype.insertInfomationTestData = function(callback) {
      var infomation, nowDate, sql;
      sql = 'INSERT INTO infomations SET ?';
      nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
      infomation = {
        UUID: my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013'),
        salesText: '(*´人｀*)',
        detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      return this.executeSQL(sql, infomation, callback);
    };

    ClientProvider.prototype.insertActiveTestData = function(callback) {
      var active, nowDate, sql;
      nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
      active = {
        UUID: my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013'),
        deviceID: 'testtesttest',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      sql = "INSERT INTO actives SET ? ON DUPLICATE KEY update updatedAt = '" + nowDate + "'";
      return this.executeSQL(sql, active, callback);
    };

    ClientProvider.prototype.findStoreInfo = function(params, callback) {
      var UUID, sql;
      console.log('-------- findStoreInfo --------', params);
      sql = 'SELECT stores.name AS storeName, salesText, categories.name AS categoryName FROM stores LEFT JOIN infomations ON stores.UUID = infomations.UUID LEFT JOIN categories ON stores.categoryID = categories.id WHERE stores.UUID = ? ORDER BY infomations.id DESC LIMIT 1';
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.findStoreDetail = function(params, callback) {
      var UUID, sql;
      console.log('-------- findStoreDetail --------', params);
      sql = 'SELECT stores.name AS storeName, salesText, detailText, url, categories.name AS categoryName, infomations.createdAt, infomations.updatedAt FROM stores LEFT JOIN infomations ON stores.UUID = infomations.UUID LEFT JOIN categories ON stores.categoryID = categories.id WHERE stores.UUID = ? ORDER BY infomations.id DESC LIMIT 1';
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.getActiveCustomerCount = function(params, callback) {
      var UUID, sql;
      console.log('-------- getActiveCustomer --------\n', params);
      sql = 'SELECT count(UUID) AS activeCustomerCount FROM actives WHERE UUID = ?';
      UUID = params['UUID'] || my.createHash('b0fc460-14a6-43a1-abcd-cb9cfddb4013');
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.isValidRequest = function(params, callback) {
      var UUID, sql;
      console.log('-------- isValidRequest --------', params);
      sql = 'SELECT count(*) FROM stores WHERE UUID = ?';
      UUID = params['UUID'];
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.notifyActiveCustomer = function(params, callback) {
      var UUID, active, deviceID, nowDate, sql;
      console.log('-------- notifyActiveCustomer --------', params);
      nowDate = moment().format('YYYY-MM-DD HH:mm:ss');
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      deviceID = params['deviceID'];
      active = {
        UUID: UUID,
        deviceID: deviceID,
        createdAt: nowDate,
        updatedAt: nowDate
      };
      sql = "INSERT INTO actives SET ? ON DUPLICATE KEY update updatedAt = '" + nowDate + "'";
      return this.executeSQL(sql, active, callback);
    };

    return ClientProvider;

  })();

  exports.ClientProvider = new ClientProvider();

}).call(this);
