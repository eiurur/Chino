'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('InitCtrl', ['$scope', 'ClientService', function ($scope, ClientService) {
    console.log("intt Controll");

    // データの初期設定
    ClientService.init();
    ClientService.findStoreInfo().
      success(function(data) {
        console.log(data);
      });
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