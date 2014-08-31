'use strict';

/* Controllers */

angular.module('myApp.controllers', ['textAngular'])
  .controller('AdminUserCtrl',
    ['$scope', '$location', '$rootScope', '$window', 'ClientService', 'AuthenticationService',
    function ($scope, $location, $rootScope, $window, ClientService, AuthenticationService) {

    console.log("AdminUserCtrl isAuthenticated = " + AuthenticationService.isAuthenticated);

    if (!AuthenticationService.isAuthenticated) {

      // データベースにセッションを問い合わせ
      ClientService.isAuthenticated()
        .success(function(data) {
          var id = data.data;

          console.log("AdminUserCtrl isAuthenticated  data = ", data);
          if(id > 0) {
            console.log("AdmiUser Ctrl (^O^) ----> /");
            AuthenticationService.isAuthenticated = true;
            $location.path("/");
          }
          // else {
          //   console.log("AdmiUser Ctrl (・ω<) ----> /sigin");
          //   $location.path("/signin");
          // }

      }).error(function(status, data) {

        console.log(status);
        console.log(data);

      });
    }


    /**
     * ここから始まり
     */

    $scope.alert = null;

    $scope.signIn = function signIn(email, password) {

      console.log("signIn -----------------------------------------------------------");

      if (email !== undefined && password !== undefined) {
        ClientService.signIn(email, password).
          success(function(data) {

              console.log("sign in  ", data.data);
              console.log("_data.data.token = " + data.token);
              console.log("_.isUndefined(data.data.token)) = " + _.isUndefined(data.token));
              console.log("_.isEmpty(data.token) = " + _.isEmpty(data.data.token));
              console.log("_.isEmpty(data.token + '') = " + _.isEmpty(data.data.token + ''));

            // Lo-dashのisEmptyは配列、オブジェクト、文字列しか判定してくれない。 === 数字は全てtureになる。
            // if(_.isUndefined(data.token)) {
            if(data.data.userNum === 0) {
              // $location.path("/signin");
              $scope.alert = { type: 'error', msg: 'メールアドレスまたはパスワードが間違っています。'};
            } else {
              AuthenticationService.isAuthenticated = true;
              $window.sessionStorage.token = data.token;
              $location.path("/");
            }


        }).error(function(status, data) {

          console.log("sign in 失敗");

          console.log(status);
          console.log(data);

        });
      }
    };

    $scope.signOut = function signOut() {


      console.log("signOut -----------------------------------------------------------");

      console.log("Controller SignOut: AuthenticationService.isAuthenticated = " + AuthenticationService.isAuthenticated);
        if(AuthenticationService.isAuthenticated) {
          ClientService.signOut()
            .success(function(data) {

              console.log("controllers SignOut data = ", data);
              console.log("AdminUserCtrl Signout isAuthenticated 前　=" + AuthenticationService.isAuthenticated);

              AuthenticationService.isAuthenticated = false;

              console.log("AdminUserCtrl Signout isAuthenticated 後 =" + AuthenticationService.isAuthenticated);

              delete $window.sessionStorage.token;
              $location.path("/signin");

          }).error(function(status) {

            console.log(status);
            console.log(data);

          });
        } else {
          console.log("API sign out -> signin");
          $location.path("/signin");
        }
    };


    $scope.signUp = function signUp(email, password) {

      console.log("signUp -----------------------------------------------------------");

      if (AuthenticationService.isAuthenticated) {
          alert("b");
        $location.path("/");
      } else {
        ClientService.signUp(email, password).success(function(data) {
          // 同じメールアドレスの人がいた場合
          if(_.isUndefined(data.data)) {
            $scope.alert = { type: 'error', msg: '登録済みのメールアドレスです。'};
          } else {
            $location.path("/signin");
          }
        }).error(function(status, data) {
          console.log(status);
          console.log(data);
        });
      }

    };

  }])
  .controller('InitCtrl', ['$scope', 'ClientService', function ($scope, ClientService) {
    console.log("intt Controll");

    // データの初期設定
    ClientService.init();
    ClientService.findStoreInfo().
      success(function(data) {
        console.log(data);
      });

  }])
  .controller('UserCtrl',
    ['$scope', '$http', '$location', '$rootScope', '$window', 'ClientService', 'UserService', 'AuthenticationService',
    function ($scope, $http, $location, $rootScope, $window, ClientService, UserService, AuthenticationService) {

    console.log("UserCtrl isAuthenticated = " + AuthenticationService.isAuthenticated);


    var storeID = null;
    var storeData = null;
    var UUID = null;

    //　これがnull以外なら広告内容の編集とみなし、INSERTではなくUPDATEを実行する
    $scope.infomationID = null;

    // 仮
    $scope.infomationList = [];
    $scope.isRestRegisteredStore = false;


    // データベースにセッションを問い合わせ
    ClientService.isAuthenticated()
      .success(function(data) {
        storeID = data.data;
        console.log("UserCtrl isAuthenticated  data = ", data.data);
        console.log("UserCtrl isAuthenticated  storeID = ", storeID);

        if (!AuthenticationService.isAuthenticated) {
          if(storeID > 0) {
            console.log("UserCtrl (^O^) ----> /");
            AuthenticationService.isAuthenticated = true;
            $location.path("/");
          } else {
            console.log("AdmiUser Ctrl (・ω<) ----> /sigin");
            $location.path("/signin");
          }
        }

        // セッションがあればUUIDを事前に取得しておく
        ClientService.getStoreData(storeID)
          .success(function(data) {

            // どっちかあとで消す
            UUID = data.data.UUID;
            storeData = data.data;

            console.log("storeData = ", storeData);

            $scope.storeName = data.data.name || 'No Name';
            $scope.isRestRegisteredStore = true;
            if($scope.storeName === 'No Name') {
              $scope.isRestRegisteredStore = false;
            }

            $scope.storeURL = data.data.url;



            console.log("UserService.categories", UserService.categories);

            $scope.categories = UserService.categories;
            $scope.storeCategory = $scope.categories[storeData.categoryID-1];

            console.log("$scope.storeCategory", $scope.storeCategory);

            console.log("UserCtrl UUID = ", UUID);

            // 過去ログの取得
            $http.post("/api/getLogsOfInfomation", {
              UUID: UUID
            }).success(function (data, status, headers, config) {
              // TODO
              console.log("registerInfogetLogsOfInfomationmation data", data);

              // 複数回呼び出すバグを修正できたら削除
              // _.each(data, function(obj, idx){
              //   if(_.findWhere($scope.infomationList, {id: obj.id})) {
              //     return;
              //   }
              //   $scope.infomationList[$scope.infomationList.length-1] = obj;

              // });

              if(_.isNull(data.UUID)) {
                return;
              }

              $scope.infomationList = data.data;

              console.log("$scope.infomations list = ", $scope.infomationList);
              console.log("$scope.infomations list.length = ", $scope.infomationList.length);
              // $scope.infomationList = data;
            }).error(function (data, status, headers, config) {
                // TODO
            });

          });

    }).error(function(status, data) {

      console.log(status);
      console.log(data);

    });

    $scope.isAuthenticated = AuthenticationService.isAuthenticated;


    /**
     * Timepicker
     */
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.mytime = d;
    };

    $scope.changed = function () {
      console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };


    /**
     * Pagenation
     */
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;


    /**
     * 登録用
     */
    $scope.registerInfomation = function() {
      if(_.isNull($scope.infomationID)){
        console.log("aaa");
        registerInfomation(0);
        return;
      }
      updateInfomation(0);
    };

    // 広告情報を下書きとして保存
    $scope.draftInfomation = function() {
      if(_.isNull($scope.infomationID)){
        registerInfomation(1);
        return;
      }
      updateInfomation(1);
    }

    function registerInfomation(isDraft) {
      // TODO: serviceに追加
      // 宣伝情報をデータベースに格納
      $http.post("/api/registerInfomation", {
          UUID: UUID
        , salesText: $scope.salesText
        , detailText: $scope.htmlVariable
        , isDraft: isDraft
      }).success(function (data, status, headers, config) {

        console.log("registerInfomation data", data);
        console.log("registerInfomation $scope.storeCategory", $scope.storeCategory);

        clearScope();

        if(!($scope.isRestRegisteredStore)) {

          // お店の情報を登録
          $http.post("/api/updateStoreRestInfomation", {
              UUID: UUID
            , name: $scope.storeName
            , url: $scope.storeURL
            , categoryID: $scope.storeCategory.id
          }).success(function (data, status, headers, config) {

            console.log("registerInfomation data", data);
            $scope.isRestRegisteredStore = true;

          }).error(function (data, status, headers, config) {
              // TODO
          });

        }

        // 登録した広告情報を問い合わせ、Listに格納
        $http.post('/api/getLastInfomation', {
          UUID: UUID
        }).success(function(data) {

          console.log("controller getLastInfomation data = ", data.data);

          $scope.infomationList.push(data.data);

          // 広告内容編集状態から初期状態に戻す
          $scope.infomationID = null;

          console.log("追加後 $scope.infomations list = ", $scope.infomationList);

        }).error(function(status, data) {

          console.log(status);
          console.log(data);
        });

        // 登録した宣伝情報をログのリスト配列に追加
        // $http.get('api/getLastInfomationID')
        //   .success(function(data) {
        //     var lastID = data.id;

        //     // 最後に
        //   }).error(function(status, data) {

        //     console.log(status);
        //     console.log(data);

        //   });

      }).error(function (data, status, headers, config) {
          // TODO
      });
    }

    // TODO: Serviceに移動
    function clearScope() {
      $scope.salesText = '';
      $scope.htmlVariable = '';
    }


    /**
     * 編集用
     */
    $scope.edit = function(e) {
      console.log($scope.infomationID);
      var target = $(e.target);
      var salesTextLog = target.data('salestext');
      var detailTextLog = target.data('detailtext');
      $scope.infomationID = target.data('id');
      $scope.salesText = salesTextLog;
      $scope.htmlVariable = detailTextLog;

      //// TODO: activeクラスを付与

      console.log($scope.infomationID);
      console.log(salesTextLog);
      console.log(detailTextLog);
    }

    function updateInfomation(isDraft) {

      // 広告内容の修正
      $http.post("/api/updateInfomation", {
          infomationID: $scope.infomationID
        , salesText: $scope.salesText
        , detailText: $scope.htmlVariable
        , isDraft: isDraft
      }).success(function (data, status, headers, config) {

        console.log("registerInfomation data", data);

        clearScope();

        // 編集した広告情報を問い合わせ、Listに反映
        $http.post('/api/getInfomationByInfomationID', {
          infomationID: $scope.infomationID
        }).success(function(data) {

          console.log("controller getInfomationByInfomationID data = ", data.data);

          var match = _.each($scope.infomationList, function(item, i) {
            if(item.id === $scope.infomationID) {
              console.log(item);
              $scope.infomationList[i] = data.data;
            }
          });

          $scope.infomationID = null;

          console.log("追加後 $scope.infomations list = ", $scope.infomationList);


        }).error(function(status, data) {

          console.log(status);
          console.log(data);
        });


      }).error(function (data, status, headers, config) {
          // TODO
      });
    }

  }]);
