'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'summernote'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
      controller: 'AdminUserCtrl'
    }).
    when('/signup', {
      templateUrl: 'partials/signup',
      controller: 'AdminUserCtrl'
    }).
    when('/signin', {
      templateUrl: 'partials/signin',
      controller: 'AdminUserCtrl'
    }).
    when('/admin', {
      templateUrl: 'partials/admin',
      controller: 'AdminUserCtrl'
    }).
    when('/init', {
      templateUrl: 'partials/init',
      controller: 'InitCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
