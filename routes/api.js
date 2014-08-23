var dir            = '../data/lib/'
  , crypto         = require('crypto')
  , moment         = require('moment')
  , _              = require('lodash')
  , my             = require(dir + 'my').my
  , ClientProvider = require(dir + 'model').ClientProvider
  ;


// プッシュ通知用のセールステキストを返す
exports.findStoreInfo = function(req, res) {

  var UUID = req.params.UUID;

  ClientProvider.findStoreInfo({
    UUID: UUID
  }, function(err, data) {
    console.log("--------- findStoreInfo --------");
    res.json({
      data: data
    });
  });
};

// プッシュ通知用のセールステキストを返す
exports.findStoreDetail = function(req, res) {

  var UUID = req.params.UUID;

  ClientProvider.findStoreDetail({
    UUID: UUID
  }, function(err, data) {
    console.log("--------- findStoreDetail --------");
    res.json({
      data: data
    });
  });
};

// アクティブユーザをデータベースへ通知(保存、更新)
exports.notifyActiveCustomer = function(req, res) {

  var UUID           = req.params.UUID
    , deviceIDHashed = req.params.deviceIDHashed
    ;

  ClientProvider.notifyActiveCustomer({
      UUID: UUID
    , deviceIDHashed: deviceIDHashed
  }, function(err) {
    console.log("--------- notifyActiveCustomer --------");
    if(err) {
      console.log(err);
    }
  });
};

//
exports.getActiveCustomerCount = function(req, res) {

  var UUID = req.params.UUID;

  ClientProvider.getActiveCustomerCount({
    UUID: UUID
  }, function(err) {
    console.log("--------- getActiveCustomerCount --------");
    if(err) {
      console.log(err);
    }
  });
};

// テストデータの追加
exports.init = function(req, res) {

  my.c('init');

  ClientProvider.insertStoreTestData(function(err) {
    console.log('--------- insertStoreTestData --------');
    if(err) {
      console.log(err);
    }
  });

  ClientProvider.insertCategoryTestData(function(err) {
    console.log('--------- insertCategoryTestData --------');
    if(err) {
      console.log(err);
    }
  });

  ClientProvider.insertInfomationTestData(function(err) {
    console.log('--------- insertInfomationTestData --------');
    if(err) {
      console.log(err);
    }
  });

  ClientProvider.insertActiveTestData(function(err) {
    console.log('--------- insertActiveTestData --------');
    if(err) {
      console.log(err);
    }
  });

};