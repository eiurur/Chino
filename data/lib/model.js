(function() {
  var ClientProvider, DB_HOST, DB_NAME, DB_PASSWORD, DB_URI, DB_USER, client, moment, mysql;

  mysql = require('mysql');

  moment = require('moment');

  DB_URI = process.env.CLEARDB_URI || '';

  DB_HOST = process.env.DB_HOST || 'localhost';

  DB_NAME = process.env.DB_NAME || 'cocoa';

  DB_USER = process.env.DB_USER || 'chino';

  DB_PASSWORD = process.env.DB_PASSWORD || 'rize';

  client = mysql.createConnection({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
  });

  ClientProvider = (function() {
    function ClientProvider() {}

    ClientProvider.prototype.insertStoreTestData = function(callback) {
      var nowDate, store;
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      store = {
        id: 'test',
        email: 'test@gmail.com',
        email: 'test',
        UUID: 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013',
        name: 'テスト',
        categoryID: 1,
        url: 'http://example.com',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      return client.query("INSERT INTO stores SET ?", store, function(err, data) {
        console.log('insertStoreTestData = ', data);
      });
    };

    ClientProvider.prototype.insertCategoryTestData = function(callback) {
      var category, nowDate;
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      category = {
        id: 1,
        name: '飲食店'
      };
      return client.query("INSERT INTO categories SET ?", category, function(err, data) {
        console.log('insertCategoryTestData = ', data);
        return callback(err, data);
      });
    };

    ClientProvider.prototype.insertInfomationTestData = function(callback) {
      var infomation, nowDate;
      nowDate = moment().format('YYYY-MM-DD HH:mm:dd');
      infomation = {
        storeID: 'test',
        salesText: '(*´人｀*)',
        detailText: '<p>hshs</p><img src="http://goo.gl/kvJJEM">',
        createdAt: nowDate,
        updatedAt: nowDate
      };
      return client.query("INSERT INTO infomations SET ?", infomation, function(err, data) {
        console.log('insertInfomationTestData = ', data);
      });
    };

    ClientProvider.prototype.findStoreInfo = function(params, callback) {
      var UUID;
      UUID = params['UUID'] || 'b0fc4601-14a6-43a1-abcd-cb9cfddb4013';
      console.log("findStoreInfo UUID", UUID);
      return client.query('SELECT * FROM stores WHERE UUID = ?', UUID, function(err, data) {
        console.log('insertInfomationTestData = ', data);
        return callback(err, data);
      });
    };

    ClientProvider.prototype.findStoreDetail = function(params, callback) {};

    ClientProvider.prototype.close = function(err) {
      return client.end();
    };

    return ClientProvider;

  })();

  exports.ClientProvider = new ClientProvider();

}).call(this);
