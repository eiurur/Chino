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
              $location.path("/signin");
            } else {
              AuthenticationService.isAuthenticated = true;
              $window.sessionStorage.token = data.token;
              $location.path("/");
            }


        }).error(function(status, data) {

          console.log("Sign In Failure!!!!!!!!!!");
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
        $location.path("/");
      } else {
        ClientService.signUp(email, password).success(function(data) {
          $location.path("/signin");
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

            $scope.storeName = data.data.name;
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
              $scope.infomationList = data.data;

              console.log("$scope.infomations list = ", $scope.infomationList);
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
    // $rootScope.appUrl = "http://eiurur.sakura.ne.jp/chino";

    // $scope.options = {
    //   height: 500,
    //   focus: true,
    //   tabsize: 2,
    //   styleWithSpan: false,

    //   onImageUpload: function(files, editor, welEditable) {
    //     sendFile(files[0], editor, welEditable);
    //   }
    // };

    // function sendFile(file, editor, welEditable) {
    //   data = new FormData();
    //   data.append("file", file);
    //   $.ajax({
    //     data: data,
    //     type: "POST",
    //     url: $rootScope.appUrl+"/summernote",
    //     cache: false,
    //     contentType: false,
    //     processData: false,
    //     success: function(url) {
    //       console.log('success');
    //       editor.insertImage(welEditable, url);
    //     },
    //     error: function(response){
    //       console.log('error');
    //     }
    //   });
    // }

    $scope.registerInfomation = function() {

      console.log("regist Infomation");
      console.log("salesText  = " + $scope.salesText);
      console.log("htmlVariable  = " + $scope.htmlVariable);
      console.log("storeCategory  = " + $scope.storeCategory);
      console.log("storeCategory  = ", $scope.storeCategory);

      // TODO: serviceに追加
      // 宣伝情報をデータベースに格納
      $http.post("/api/registerInfomation", {
          UUID: UUID,
          salesText: $scope.salesText,
          detailText: $scope.htmlVariable
      }).success(function (data, status, headers, config) {

          console.log("registerInfomation data", data);
          console.log("registerInfomation $scope.storeCategory", $scope.storeCategory);

          clearScope();

          if(_.isEmpty($scope.storeName)) {

            // var selectedCategory = _.findWhere(UserService.categories, {name: $scope.storeCategory});
            // console.log("updateStoreRestInfomation selectedCategory = ", selectedCategory);
            // return;

            $http.post("/api/updateStoreRestInfomation", {
                UUID: UUID,
                name: $scope.storeName,
                url: $scope.storeURL,
                categoryID: $scope.storeCategory.id
            }).success(function (data, status, headers, config) {
                console.log("registerInfomation data", data);
            }).error(function (data, status, headers, config) {
                // TODO
            });

          }

          $http.post('/api/getLastInfomation', {
            UUID: UUID
          }).success(function(data) {

            console.log("controller getLastInfomation data = ", data.data);

            // pushより早い
            $scope.infomationList.push(data.data);

            console.log("追加後 $scope.infomations list = ", $scope.infomationList);


          }).error(function(status, data) {

            console.log(status);
            console.log(data);
          });
          // 登録した宣伝情報をログのリスト配列に追加
          $http.get('api/getLastInfomationID')
            .success(function(data) {
              var lastID = data.id;

              // 最後に
            }).error(function(status, data) {

              console.log(status);
              console.log(data);

            });

      }).error(function (data, status, headers, config) {
          // TODO
      });

    };

    // TODO: Serviceに移動
    function clearScope() {
      $scope.salesText = '';
      $scope.htmlVariable = '';
    }

  }]);
