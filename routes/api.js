var dir            = '../data/lib/'
  , crypto         = require('crypto')
  , moment         = require('moment')
  , _              = require('lodash')
  , my             = require(dir + 'my').my
  , ClientProvider = require(dir + 'model').ClientProvider
  ;


/**
 * TODO:
 * ・req.paramsの正規表現で<や>が含まれてたら弾く
 * ・画像がアップロードされたら即dropboxかAWSに保存。URLをもらってそれに置換
 */

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

  var UUID     = req.params.UUID
    , deviceID = req.params.deviceID
    ;

  ClientProvider.notifyActiveCustomer({
      UUID: UUID
    , deviceID: deviceID
  }, function(err) {
    console.log("--------- notifyActiveCustomer --------");
    if(err) {
      console.log(err);
    }
  });
};

// 現在の入店人数を返す
exports.getActiveCustomerCount = function(req, res) {

  var UUID = req.params.UUID;

  ClientProvider.getActiveCustomerCount({
    UUID: UUID
  }, function(err, data) {
    console.log("--------- getActiveCustomerCount --------");
    if(err) {
      console.log(err);
    }
    res.json({
      data: data
    });
  });
};

// 一定時間(10秒)BLEの反応が帰ってこない買い物客(退店)の入店情報を削除する
exports.clearActives = function(req, res) {
  ClientProvider.clearActives(function(err) {
    console.log("--------- clearActives --------");
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

