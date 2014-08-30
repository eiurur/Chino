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
      nowDate = my.formatYMDHms();
      store = {
        email: 'test@gmail.com',
        password: my.createHash('test'),
        UUID: my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013'),
        name: 'Rabbit House',
        categoryID: 1,
        url: 'http://gochiusa.com',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      sql = 'INSERT INTO stores SET ?';
      return this.executeSQL(sql, store, callback);
    };

    ClientProvider.prototype.insertCategoryTestData = function(callback) {
      var categories, sql;
      categories = [[1, 'ファッション'], [2, 'グッズ'], [3, 'フード'], [4, '食料品'], [5, '雑貨'], [6, '家具・インテリア'], [7, 'サービス'], [8, 'その他']];
      sql = 'INSERT INTO categories (id, name) VALUES ?';
      return this.executeSQL(sql, [categories], callback);
    };

    ClientProvider.prototype.insertInfomationTestData = function(callback) {
      var infomation, nowDate, sql;
      nowDate = my.formatYMDHms();
      infomation = {
        UUID: my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013'),
        salesText: '(*´人｀*)',
        detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">',
        isDraft: 0,
        createdAt: nowDate,
        updatedAt: nowDate
      };
      sql = 'INSERT INTO infomations SET ?';
      return this.executeSQL(sql, infomation, callback);
    };

    ClientProvider.prototype.insertActiveTestData = function(callback) {
      var active, nowDate, sql;
      nowDate = my.formatYMDHms();
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
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      sql = 'SELECT stores.name AS storeName, salesText, categories.name AS categoryName FROM stores LEFT JOIN infomations ON stores.UUID = infomations.UUID LEFT JOIN categories ON stores.categoryID = categories.id WHERE stores.UUID = ? ORDER BY infomations.id DESC LIMIT 1';
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.findStoreDetail = function(params, callback) {
      var UUID, sql;
      console.log('-------- findStoreDetail --------', params);
      UUID = params['UUID'] || my.createHash('b0fc4601-14a6-43a1-abcd-cb9cfddb4013');
      sql = 'SELECT stores.name AS storeName, salesText, detailText, url, categories.name AS categoryName, infomations.createdAt, infomations.updatedAt FROM stores LEFT JOIN infomations ON stores.UUID = infomations.UUID LEFT JOIN categories ON stores.categoryID = categories.id WHERE stores.UUID = ? AND isDraft = 0 ORDER BY infomations.id DESC LIMIT 1';
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.getActiveCustomerCount = function(params, callback) {
      var UUID, sql;
      console.log('-------- getActiveCustomer --------\n', params);
      UUID = params['UUID'] || my.createHash('b0fc460-14a6-43a1-abcd-cb9cfddb4013');
      sql = 'SELECT count(UUID) AS activeCustomerCount FROM actives WHERE UUID = ?';
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.isValidRequest = function(params, callback) {
      var UUID, sql;
      console.log('-------- isValidRequest --------', params);
      UUID = params['UUID'];
      sql = 'SELECT count(*) FROM stores WHERE UUID = ?';
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.notifyActiveCustomer = function(params, callback) {
      var UUID, active, deviceID, nowDate, sql;
      console.log('-------- notifyActiveCustomer --------', params);
      nowDate = my.formatYMDHms();
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

    ClientProvider.prototype.clearActives = function(callback) {
      var dateBefore10Seconds, sql;
      console.log('-------- clearActives --------');
      dateBefore10Seconds = my.addSecondsFormatYMDHms('-10');
      sql = 'DELETE FROM actives WHERE updatedAt < ?';
      return this.executeSQL(sql, dateBefore10Seconds, callback);
    };

    ClientProvider.prototype.signUp = function(params, callback) {
      var UUID, email, nowDate, password, passwordSHA256, sql, store;
      console.log('-------- signUp --------');
      nowDate = my.formatYMDHms();
      email = params['email'];
      password = params['password'];
      passwordSHA256 = my.createHash(password);
      UUID = params['UUID'];
      store = {
        email: email,
        password: passwordSHA256,
        UUID: UUID,
        createdAt: nowDate,
        updatedAt: nowDate
      };
      sql = 'INSERT INTO stores SET ?';
      return this.executeSQL(sql, store, callback);
    };

    ClientProvider.prototype.signIn = function(params, callback) {
      var email, emailAndPass, password, passwordSHA256, sql;
      console.log('-------- signIn --------');
      email = params['email'];
      password = params['password'];
      passwordSHA256 = my.createHash(password);
      emailAndPass = [email, passwordSHA256];
      console.log('emailAndPAss', emailAndPass);
      sql = 'SELECT count(*) AS userNum, id, email FROM stores WHERE email = ? AND password = ?';
      return this.executeSQL(sql, emailAndPass, callback);
    };

    ClientProvider.prototype.getLogsOfInfomation = function(params, callback) {
      var UUID, sql;
      console.log('-------- getLogsOfInfomation --------');
      UUID = params['UUID'];
      console.log("getLogsOfInfomation UUID = ", UUID);
      sql = 'SELECT id, salesText, detailText, isDraft, createdAt, updatedAt FROM infomations WHERE UUID = ? ORDER BY infomations.id DESC';
      return this.executeSQL(sql, UUID, callback);
    };

    ClientProvider.prototype.deleteSessionID = function(params, callback) {
      var session_id, sql;
      console.log('-------- deleteSessionID --------');
      session_id = params['session_id'];
      console.log("deleteSessionID = " + session_id);
      sql = 'DELETE FROM sessions WHERE session_id = ?';
      return this.executeSQL(sql, session_id, callback);
    };

    ClientProvider.prototype.isAuthenticated = function(params, callback) {
      var session_id, sql;
      console.log('-------- isAuthenticated --------');
      session_id = params['session_id'];
      console.log("isAuthenticated = " + session_id);
      sql = 'SELECT count(*) AS userNum FROM sessions WHERE session_id = ?';
      return this.executeSQL(sql, session_id, callback);
    };

    ClientProvider.prototype.registerInfomation = function(params, callback) {
      var UUID, detailText, infomation, isDraft, nowDate, salesText, sql;
      nowDate = my.formatYMDHms();
      UUID = params['UUID'];
      salesText = params['salesText'];
      detailText = params['detailText'];
      isDraft = params['isDraft'];
      infomation = {
        UUID: UUID,
        salesText: salesText,
        detailText: detailText,
        isDraft: isDraft,
        createdAt: nowDate,
        updatedAt: nowDate
      };
      sql = 'INSERT INTO infomations SET ?';
      return this.executeSQL(sql, infomation, callback);
    };

    ClientProvider.prototype.updateStoreRestInfomation = function(params, callback) {
      var UUID, categoryID, name, nowDate, sql, store, url;
      console.log('updateStoreRestinfomatiion = ', params);
      nowDate = my.formatYMDHms();
      UUID = params['UUID'];
      name = params['name'];
      url = params['url'];
      categoryID = params['categoryID'];
      store = {
        name: name,
        url: url,
        categoryID: categoryID,
        updatedAt: nowDate
      };
      sql = 'UPDATE stores SET ? WHERE UUID = ?';
      return this.executeSQL(sql, [store, UUID], callback);
    };

    ClientProvider.prototype.getStoreData = function(params, callback) {
      var sql, storeID;
      console.log('-------- getStoreData --------');
      storeID = params['storeID'];
      sql = 'SELECT name, UUID, categoryID, url FROM stores WHERE id = ?';
      return this.executeSQL(sql, storeID, callback);
    };

    ClientProvider.prototype.getLastInfomation = function(params, callback) {
      var UUID, sql;
      console.log('-------- getLastInfomation --------');
      UUID = params['UUID'];
      sql = 'SELECT id, salesText, detailText, isDraft, createdAt, updatedAt FROM infomations WHERE UUID = ? ORDER BY id DESC LIMIT 1';
      return this.executeSQL(sql, UUID, callback);
    };

    return ClientProvider;

  })();

  exports.ClientProvider = new ClientProvider();

}).call(this);
