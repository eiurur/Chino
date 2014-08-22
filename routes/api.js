var dir            = '../data/lib/'
  , crypto         = require('crypto')
  , moment         = require('moment')
  , _              = require('lodash')
  , my             = require(dir + 'my').my
  , ClientProvider = require(dir + 'model').ClientProvider
  ;

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

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


  res.json({
    status: 'ok'
  });

};