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
    var data = "ok";
    if(err) {
      console.log(err);
      data = "err";
    }

    res.json({
      data: data
    });
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


/**
 * クライアントサイド
 */

exports.signUp = function(req, res) {

  var email = req.body.email;
  var password = req.body.password;

  // UNIXTIMESTAMP(millseconds)をハッシュ化して仮のUUIDとしておく
  // (理由) UUIDはユニークキーだが、初期設定の段階で入力できないため、テーブルには空の値が保存される => 2つ以上データが格納されるとエラー
  // それを回避するため。
  var UUID = my.createHash((new Date).getTime() + '');


  ClientProvider.signUp({
      email: email
    , password: password
    , UUID: UUID
  }, function(err, data) {
    console.log("--------- signUp --------");

    if(err) console.log(err);

    res.json({
      data: data
    });
  });

}

exports.signIn = function(req, res) {

  // パスワードの確認はAngularJSで行う。

  var email = req.body.email;
  var password = req.body.password;

  console.log(email, password);


  ClientProvider.signIn({
      email: email
    , password: password
  }, function(err, data) {
    console.log("--------- signIn --------");

    if(err) console.log(err);

    console.log("sign in data userNum = ", data[0].userNum);

    // ログイン成功
    if(data[0].userNum === 1) {
      if (req.session.user) {
        console.log(req.session);
      } else {
        req.session.user = {
            id: data[0].id
          , email: data[0].email
        }
      }
      console.log("後 req.session.session_id = " + req.session.id);
      console.log("signUp session = " + req.session.user.id);
      console.log("signUp session まるまる= ", req.session);
    }

    var token = data[0].id || '';

    console.log("sign in data = ", data);
    console.log("sign in token = ", token);

    res.json({
        data: data[0]
      , token: token
    });
  });

}

exports.signOut = function(req, res) {

  console.log("!_.has前 API sign out req.session = ", req.session);

  if(!_.has(req.session, 'id')) return;

  // if(!_.has(req.session, 'user')) return;

  // console.log("API signOut req.session.usre = ", req.session.user);

  // if(_.isUndefined(req.session.user.id)) return;

  console.log("API signOut req.session.id = " + req.session.id);

  ClientProvider.deleteSessionID({
    session_id:  req.session.id
  }, function(err, data) {
    console.log("--------- API sign Out --------");

    // delete req.session.user;
    delete req.session;

    if(err) console.log(err);

    console.log("API deleteSessionID data = ", data);

    console.log("API delete後　signOut req.session", req.sesion);

    res.json({
        data: data
    });
  });

}

exports.isAuthenticated = function(req, res) {

  console.log("isAuthenticated req.session.id = " + req.session.id);

  ClientProvider.isAuthenticated({
      session_id:  req.session.id
  }, function(err, data) {
    console.log("--------- isAuthenticated --------");

    if(err) console.log(err);

    console.log("isAuthticated data = ", data);
    console.log("isAuthticated data[0] = ", data[0]);

    res.json({
        data: data[0]
    });
  });

}
