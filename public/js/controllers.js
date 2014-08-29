'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AdminUserCtrl',
    ['$scope', '$location', '$rootScope', '$window', 'ClientService', 'AuthenticationService',
    function ($scope, $location, $rootScope, $window, ClientService, AuthenticationService) {

    console.log("AdminUserCtrl isAuthenticated = " + AuthenticationService.isAuthenticated);

    if (!AuthenticationService.isAuthenticated) {

      // データベースにセッションを問い合わせ
      ClientService.isAuthenticated()
        .success(function(data) {

          console.log("AdminUserCtrl isAuthenticated  data = ", data);
          console.log("AdminUserCtrl isAuthenticated  data.data = ", data.data);
          console.log("AdminUserCtrl isAuthenticated  data.data.userNum = " + data.data.userNum);
          if(data.data.userNum === 1) {
            console.log("AdmiUser Ctrl (^O^) ----> /");
            AuthenticationService.isAuthenticated = true;
            $location.path("/");
          } else {
            console.log("AdmiUser Ctrl (・ω<) ----> /sigin");
            $location.path("/signin");
          }

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

              console.log("controllers SignOut affectedRows = " + data.affectedRows);
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
    ['$scope', '$location', '$rootScope', '$window', 'ClientService', 'AuthenticationService',
    function ($scope, $location, $rootScope, $window, ClientService, AuthenticationService) {

    console.log("UserCtrl isAuthenticated = " + AuthenticationService.isAuthenticated);

    $rootScope.appUrl = "http://eiurur.sakura.ne.jp/chino";

    $scope.options = {
      height: 200,
      focus: true,
      tabsize: 2,
      styleWithSpan: false,

      onImageUpload: function(files, editor, welEditable) {
        sendFile(files[0], editor, welEditable);
      }
    };

    function sendFile(file, editor, welEditable) {
      data = new FormData();
      data.append("file", file);
      $.ajax({
        data: data,
        type: "POST",
        url: $rootScope.appUrl+"/summernote",
        cache: false,
        contentType: false,
        processData: false,
        success: function(url) {
          console.log('success');
          editor.insertImage(welEditable, url);
        },
        error: function(response){
          console.log('error');
        }
      });
    }
  }])
  .controller('SignUpCtrl', function ($scope, $http, $location) {
    $scope.form = {};
    $scope.submitPost = function () {
      $http.get('/api/post', $scope.form).
        success(function(data) {
          $location.path('/');
        });
    };
  })
  .controller('SignInCtrl', function ($scope, $http, $location) {
    $scope.form = {};
    $scope.submitPost = function () {
      $http.get('/api/post', $scope.form).
        success(function(data) {
          $location.path('/');
        });
    };
  });